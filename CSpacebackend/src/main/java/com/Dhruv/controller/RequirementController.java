package com.Dhruv.controller;

import java.util.List;

import com.Dhruv.response.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Dhruv.DTO.RequirementDTO;
import com.Dhruv.exception.RequirementException;
import com.Dhruv.exception.ProjectException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Requirement;
import com.Dhruv.model.User;
import com.Dhruv.request.RequirementRequest;
import com.Dhruv.service.RequirementService;
import com.Dhruv.service.UserService;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = "http://localhost:5173")
public class RequirementController {

    @Autowired
    private RequirementService requirementService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Requirement>> getAllRequirements(@RequestHeader("Authorization") String token) throws RequirementException, UserException, ProjectException {
        User user = userService.findUserProfileByJwt(token);
        List<Requirement> requirements = requirementService.getAllRequirementsExceptUser(user.getId());
        return ResponseEntity.ok(requirements);
    }
    
    @GetMapping("/{RequirementId}")
    public ResponseEntity<Requirement> getRequirementById(@PathVariable Long RequirementId) throws RequirementException {
        return ResponseEntity.ok(requirementService.getRequirementById(RequirementId).get());
                
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Requirement>> getRequirementByProjectId(@PathVariable Long projectId)
            throws ProjectException {
        return ResponseEntity.ok(requirementService.getRequirementByProjectId(projectId));

    }

    @PostMapping
    public ResponseEntity<RequirementDTO> createRequirement(@RequestBody RequirementRequest Requirement, @RequestHeader("Authorization") String token) throws UserException, RequirementException, ProjectException {
    	System.out.println("Requirement-----"+Requirement);
    	User tokenUser = userService.findUserProfileByJwt(token);
        User user = userService.findUserById(tokenUser.getId());

        if (user != null) {
 
            Requirement createdRequirement = requirementService.createRequirement(Requirement, tokenUser.getId());
            RequirementDTO requirementDTO =new RequirementDTO();
            requirementDTO.setDescription(createdRequirement.getDescription());
            requirementDTO.setDueDate(createdRequirement.getDueDate());
            requirementDTO.setId(createdRequirement.getId());
            requirementDTO.setPriority(createdRequirement.getPriority());
            requirementDTO.setProject(createdRequirement.getProject());
            requirementDTO.setProjectID(createdRequirement.getProjectID());
            requirementDTO.setStatus(createdRequirement.getStatus());
            requirementDTO.setTitle(createdRequirement.getTitle());
            requirementDTO.setTags(createdRequirement.getTags());
            requirementDTO.setAssignee(createdRequirement.getAssignee());
            
            return ResponseEntity.ok(requirementDTO);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{RequirementId}")
    public ResponseEntity<Requirement> updateRequirement(@PathVariable Long RequirementId, @RequestBody RequirementRequest updatedRequirement,
                                                   @RequestHeader("Authorization") String token) throws RequirementException, UserException, ProjectException {
    	User user = userService.findUserProfileByJwt(token);
    	System.out.println("user______>"+user);
        Requirement updated = requirementService.updateRequirement(RequirementId,updatedRequirement, user.getId()).get();

        return updated != null ?
                ResponseEntity.ok(updated) :
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{RequirementId}")
    public ResponseEntity<AuthResponse> deleteRequirement(@PathVariable Long RequirementId, @RequestHeader("Authorization") String token) throws UserException, RequirementException, ProjectException {
        User user = userService.findUserProfileByJwt(token);
        String deleted = requirementService.deleteRequirement(RequirementId, user.getId());

        AuthResponse res=new AuthResponse();
        res.setMessage("Requirement deleted");
        res.setStatus(true);

        return ResponseEntity.ok(res);
               
    }

    
    @GetMapping("/search")
    public ResponseEntity<List<Requirement>> searchRequirements(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assigneeId
    ) throws RequirementException {
        // You can add more parameters as needed for your filtering criteria
        // Use the parameters to build a search query and call the service method

        List<Requirement> filteredRequirements = requirementService.searchRequirements(title, status, priority, assigneeId);

        return ResponseEntity.ok(filteredRequirements);
    }


    @PutMapping ("/{RequirementId}/assignee/{userId}")
    public ResponseEntity<Requirement> addUserToRequirement(@PathVariable Long RequirementId, @PathVariable Long userId) throws UserException, RequirementException {
       
            Requirement requirement = requirementService.addUserToRequirement(RequirementId, userId);

            return ResponseEntity.ok(requirement);
        
    }

    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<Requirement>> getRequirementsByAssigneeId(@PathVariable Long assigneeId) throws RequirementException {
        List<Requirement> requirements = requirementService.getRequirementsByAssigneeId(assigneeId);
        return ResponseEntity.ok(requirements);
    }

    @PutMapping("/{RequirementId}/status/{status}")
    public ResponseEntity<Requirement>updateRequirementStatus(
            @PathVariable String status,
            @PathVariable Long RequirementId) throws RequirementException {
        Requirement requirement = requirementService.updateStatus(RequirementId,status);
        return ResponseEntity.ok(requirement);
    }


}

