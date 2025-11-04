package com.Dhruv.controller;
import java.util.List;
import java.util.stream.Collectors;

import com.Dhruv.exception.MailsException;
import com.Dhruv.model.Invitation;
import com.Dhruv.request.ProjectInvitationRequest;
import com.Dhruv.service.InvitationService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Dhruv.exception.ChatException;
import com.Dhruv.exception.ProjectException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Chat;
import com.Dhruv.model.Project;
import com.Dhruv.model.User;
import com.Dhruv.response.MessageResponse;
import com.Dhruv.service.ProjectService;
import com.Dhruv.service.UserService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private InvitationService invitationService;


    @GetMapping
    public ResponseEntity<List<Project>> getProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestHeader("Authorization") String token) throws ProjectException, UserException {

        User user = userService.findUserProfileByJwt(token);

        List<Project> allProjects = projectService.getAllProjects(category, tag);

        List<Project> otherUsersProjects = allProjects.stream()
                .filter(project -> !project.getOwner().getId().equals(user.getId()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(otherUsersProjects, HttpStatus.OK);
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<Project>> getMyProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestHeader("Authorization") String token) throws ProjectException, UserException {

        User user = userService.findUserProfileByJwt(token);
        List<Project> projects = projectService.getProjectsByTeam(user, category, tag);

        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) throws ProjectException {
        Project project = projectService.getProjectById(projectId);
        return project != null ?
                new ResponseEntity<>(project, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestBody Project project,
                                                 @RequestHeader("Authorization") String token) throws UserException, ProjectException {
        User user = userService.findUserProfileByJwt(token);
        project.setOwner(user);
        Project createdProject = projectService.createProject(project, user.getId());
        userService.updateUsersProjectSize(user,1);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(
            @RequestBody Project updatedProject,
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String token) throws UserException, ProjectException {

        User user = userService.findUserProfileByJwt(token);

        Project existingProject = projectService.getProjectById(projectId);
        if (!existingProject.getOwner().getId().equals(user.getId())) {
            throw new ProjectException("Only project owner can update the project");
        }

        Project updated = projectService.updateProject(updatedProject, projectId, user.getId());
        return updated != null ?
                new ResponseEntity<>(updated, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<MessageResponse> deleteProject(@PathVariable Long projectId, @RequestHeader("Authorization") String token) throws UserException, ProjectException {
        User user = userService.findUserProfileByJwt(token);

        MessageResponse response =new MessageResponse(projectService.deleteProject(projectId, user.getId()));
        userService.updateUsersProjectSize(user,-1);
        return ResponseEntity.ok(response);
    }

//    @GetMapping("/user")
//    public ResponseEntity<List<Project>> getProjectsByOwner(@RequestHeader("Authorization") String token) throws ProjectException {
//        try {
//            User owner = userService.findUserProfileByJwt(token);
//            List<Project> projects = projectService.getProjectsByOwner(owner);
//            return new ResponseEntity<>(projects, HttpStatus.OK);
//        } catch (UserException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }



    @GetMapping("/search")
    public ResponseEntity< List<Project>> searchProjects(
            @RequestParam(required = false) String keyword,
            @RequestHeader("Authorization") String jwt
    ) throws ProjectException, UserException {
        User user=userService.findUserProfileByJwt(jwt);
            List<Project> projects = projectService.searchProjects(keyword,user);
            return ResponseEntity.ok(projects);
    }
    
    @PostMapping("/{userId}/add-to-project/{projectId}")
    public ResponseEntity<MessageResponse> addUserToProject(
            @PathVariable Long userId,
            @PathVariable Long projectId) throws UserException, ProjectException {
        projectService.addUserToProject(projectId, userId);
        MessageResponse response =new MessageResponse("User added to the project successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{projectId}/chat")
    public ResponseEntity<Chat> getChatByProjectId(@PathVariable Long projectId)
            throws ProjectException, ChatException {
        Chat chat = projectService.getChatByProjectId(projectId);
        return chat != null ? ResponseEntity.ok(chat) : ResponseEntity.notFound().build();
    }



    @PostMapping("/invite")
    public ResponseEntity<MessageResponse> inviteToProject(
            @RequestBody ProjectInvitationRequest req,
            @RequestHeader("Authorization") String jwt) throws MailsException, MessagingException, UserException, ProjectException {

        User user = userService.findUserProfileByJwt(jwt);

        Project project = projectService.getProjectById(req.getProjectId());

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new ProjectException("Only project owner can invite members");
        }

        invitationService.sendInvitation(req.getEmail(), req.getProjectId());

        MessageResponse res = new MessageResponse();
        res.setMessage("User invited to the project successfully");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/accept_invitation")
    public ResponseEntity<Invitation> acceptInvitation(@RequestParam String token,
                                   @RequestHeader("Authorization") String jwt) throws Exception {

        User user=userService.findUserProfileByJwt(jwt);

        Invitation invitation = invitationService.acceptInvitation(token,user.getId());
        projectService.addUserToProject(invitation.getProjectId(),user.getId());

        return new ResponseEntity<>(invitation,HttpStatus.ACCEPTED);
    }

    
}




