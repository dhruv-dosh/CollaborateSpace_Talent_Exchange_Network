package com.Dhruv.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Dhruv.exception.ChatException;
import com.Dhruv.exception.ProjectException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Chat;
import com.Dhruv.model.Project;
import com.Dhruv.model.User;
import com.Dhruv.repository.ProjectRepository;

import jakarta.transaction.Transactional;

@Service
public class ProjectServiceImpl implements ProjectService {

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ChatService chatService;
	@Autowired
	private InvitationService inviteTokenService;

	@Autowired
	private UserService userService;

	@Override
	public Project createProject(Project project,Long id) throws UserException  {
		User user = userService.findUserById(id);
		Project createdProject=new Project();

		createdProject.setOwner(user);
		createdProject.setTags(project.getTags());
		createdProject.setName(project.getName());
		createdProject.setCategory(project.getCategory());
		createdProject.setDescription(project.getDescription());
		createdProject.getTeam().add(user);

		System.out.println(createdProject);
		Project savedProject=projectRepository.save(createdProject);

		savedProject.getTeam().add(user);

		Chat chat = new Chat();
		chat.setProject(savedProject);
		Chat projectChat = chatService.createChat(chat);
		savedProject.setChat(projectChat);


		return savedProject;
	}

	@Override
	public List<Project> getAllProjects(String category, String tag) throws ProjectException {
		List<Project> projects = projectRepository.findAll();

		if (projects.isEmpty()) {
			throw new ProjectException("No projects available");
		}

		// Filter by category if provided
		if (category != null) {
			projects = projects.stream()
					.filter(project -> project.getCategory().equals(category))
					.collect(Collectors.toList());
		}

		// Filter by tag if provided
		if (tag != null) {
			projects = projects.stream()
					.filter(project -> project.getTags().contains(tag))
					.collect(Collectors.toList());
		}

		return projects;
	}

	@Override
	public List<Project> getProjectsByTeam(User user,String category,String tag) throws ProjectException {
		List<Project> projects= projectRepository.findByTeamContainingOrOwner(user,user);

		if (category != null) {
			projects = projects.stream()
					.filter(project -> project.getCategory().equals(category))
					.collect(Collectors.toList());
		}

		if (tag != null) {
			projects = projects.stream()
					.filter(project -> project.getTags().contains(tag))
					.collect(Collectors.toList());
		}

		return projects;
	}


	@Override
	public Project getProjectById(Long projectId) throws ProjectException {
		Optional<Project> project = projectRepository.findById(projectId);
		if(project.isPresent()) {
			return project.get();
		}
		throw new ProjectException("No project exists with the id "+projectId);
	}

	@Override
	public String deleteProject(Long projectId, Long id) throws UserException, ProjectException {
		User user = userService.findUserById(id);
		System.out.println("user ____>" + user);

		if (user != null) {
//			// Get the project to check ownership
//			Project project = getProjectById(projectId);
//
//			// Check if the current user is the owner
//			if (!project.getOwner().getId().equals(user.getId())) {
//				throw new ProjectException("You are not authorized to delete this project. Only the project owner can delete it.");
//			}
			projectRepository.deleteById(projectId);


			return "project deleted";
		}

		throw new UserException("User does not exist");
	}

	@Override
	public Project updateProject(Project updatedProject, Long id, Long userId) throws ProjectException, UserException {
		User user = userService.findUserById(userId);
		Project project = getProjectById(id);

		if (project != null) {
			// Update the existing project with the fields from updatedProject
			if (updatedProject.getName() != null) {
				project.setName(updatedProject.getName());
			}

			if (updatedProject.getDescription() != null) {
				project.setDescription(updatedProject.getDescription());
			}

			if (updatedProject.getTags() != null) {
				project.setTags(updatedProject.getTags());
			}
			if(updatedProject.getCategory() != null){
				project.setCategory(updatedProject.getCategory());
			}


			// Save the updated project once
			return projectRepository.save(project);
		}

		throw new ProjectException("Project does not exist");
	}

	@Override
	public List<Project> searchProjects(String keyword, User user) throws ProjectException {
		String partialName = "%" + keyword + "%";
//			projectRepository.findByPartialNameAndTeamIn(partialName, user);
		List<Project> list = projectRepository.findByNameContainingAndTeamContains(keyword,user);
		if(list!=null) {
			return list;
		}
		throw new ProjectException("No Projects available");
	}

	@Override
	@Transactional
	public void addUserToProject(Long projectId, Long userId) throws UserException, ProjectException {
		Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectException("project not found"));
		User user = userService.findUserById(userId);

		if (!project.getTeam().contains(user)) {
			project.getChat().getUsers().add(user);
			project.getTeam().add(user);
			projectRepository.save(project);
		}


	}

	@Override
	public void removeUserFromProject(Long projectId, Long userId) throws UserException, ProjectException {
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new ProjectException("project not found"));
		User user = userService.findUserById(userId);

		if (project.getTeam().contains(user)) {
			project.getTeam().remove(user);
			project.getChat().getUsers().remove(user);
		}

	}

	@Override
	public Chat getChatByProjectId(Long projectId) throws ProjectException, ChatException {
		Project project = projectRepository.findById(projectId).orElseThrow(()-> new ProjectException("Project not found"));
		if( project != null ) return project.getChat() ;


		throw new ChatException("no chats found");

	}

	public List<User> getUsersByProjectId(Long projectId) throws ProjectException {
		Project project = projectRepository.findById(projectId).orElse(null);
		if( project != null) return project.getChat().getUsers();

		throw new ProjectException("no project found with id "+projectId);
	}

}
