package com.Dhruv.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Dhruv.exception.RequirementException;
import com.Dhruv.exception.ProjectException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Requirement;
import com.Dhruv.model.Project;
import com.Dhruv.model.User;
import com.Dhruv.repository.RequirementRepository;
import com.Dhruv.request.RequirementRequest;

@Service
public class RequirementServiceImpl implements RequirementService {

	@Autowired
	private RequirementRepository requirementRepository;
//
	@Autowired
	private UserService userService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private NotificationServiceImpl notificationServiceImpl;

	@Override
	public List<Requirement> getAllRequirementsExceptUser(Long userId) throws RequirementException {
		List<Requirement> allRequirements = requirementRepository.findAll();

		if (allRequirements == null || allRequirements.isEmpty()) {
			throw new RequirementException("No requirements found");
		}

		List<Requirement> filteredRequirements = allRequirements.stream()
				.filter(req -> req.getProject() != null &&
						req.getProject().getOwner() != null &&
						!req.getProject().getOwner().getId().equals(userId))
				.collect(Collectors.toList());

		return filteredRequirements;
	}

	@Override
	public Optional<Requirement> getRequirementById(Long RequirementId) throws RequirementException {
		Optional<Requirement> Requirement = requirementRepository.findById(RequirementId);
		if (Requirement.isPresent()) {
			return Requirement;
		}
		throw new RequirementException("No Requirements found with Requirementid" + RequirementId);
	}

	@Override
	public List<Requirement> getRequirementByProjectId(Long projectId) throws ProjectException {
		projectService.getProjectById(projectId);
		return requirementRepository.findByProjectId(projectId);
	}

	@Override
	public Requirement createRequirement(RequirementRequest requirementRequest, Long userId)
			throws UserException, RequirementException, ProjectException {
		User user = getUserOrThrow(userId);

		// Check if the project exists
		Project project = projectService.getProjectById(requirementRequest.getProjectId());
		System.out.println("projid---------->"+ requirementRequest.getProjectId());
		if (project == null) {
			throw new RequirementException("Project not found with ID: " + requirementRequest.getProjectId());
		}

		// Create a new Requirement
		Requirement requirement = new Requirement();
		requirement.setTitle(requirementRequest.getTitle());
		requirement.setDescription(requirementRequest.getDescription());
		requirement.setStatus(requirementRequest.getStatus());
		requirement.setProjectID(requirementRequest.getProjectId());
		requirement.setPriority(requirementRequest.getPriority());
		requirement.setDueDate(requirementRequest.getDueDate());


         
		// Set the project for the Requirement
		requirement.setProject(project);

		// Save the Requirement
		return requirementRepository.save(requirement);
	}

	@Override
	public Optional<Requirement> updateRequirement(Long RequirementId, RequirementRequest updatedRequirement, Long userId)
			throws RequirementException, UserException, ProjectException {
		User user = getUserOrThrow(userId);
		Optional<Requirement> existingRequirement = requirementRepository.findById(RequirementId);
                           
		if (existingRequirement.isPresent()) {
			// Check if the project exists
			Project project = projectService.getProjectById(updatedRequirement.getProjectId());
			if (project == null) {
				throw new RequirementException("Project not found with ID: " + updatedRequirement.getProjectId());
			}

			User assignee = userService.findUserById(updatedRequirement.getUserId());
			if (assignee == null) {
				throw new UserException("Assignee not found with ID: " + updatedRequirement.getUserId());
			}

			Requirement requirementToUpdate = existingRequirement.get();


			if (updatedRequirement.getDescription() != null) {
				requirementToUpdate.setDescription(updatedRequirement.getDescription());
			}

			if (updatedRequirement.getDueDate() != null) {
				requirementToUpdate.setDueDate(updatedRequirement.getDueDate());
			}

			if (updatedRequirement.getPriority() != null) {
				requirementToUpdate.setPriority(updatedRequirement.getPriority());
			}

			if (updatedRequirement.getStatus() != null) {
				requirementToUpdate.setStatus(updatedRequirement.getStatus());
			}

			if (updatedRequirement.getTitle() != null) {
				requirementToUpdate.setTitle(updatedRequirement.getTitle());
			}

			// Save the updated Requirement
			return Optional.of(requirementRepository.save(requirementToUpdate));
		}

		throw new RequirementException("Requirement not found with Requirementid" + RequirementId);
	}

	@Override
	public String deleteRequirement(Long RequirementId, Long userId) throws UserException, RequirementException {
		getUserOrThrow(userId);
		Optional<Requirement> RequirementById = getRequirementById(RequirementId);
		if (RequirementById.isPresent()) {
			requirementRepository.deleteById(RequirementId);
			return "Requirement with the id" + RequirementId + "deleted";
		}
		throw new RequirementException("Requirement not found with Requirementid" + RequirementId);
	}

	@Override
	public List<Requirement> getRequirementsByAssigneeId(Long assigneeId) throws RequirementException {
		List<Requirement> requirements = requirementRepository.findByAssigneeId(assigneeId);
		if (requirements != null) {
			return requirements;
		}
		throw new RequirementException("Requirements not found");
	}

	private User getUserOrThrow(Long userId) throws UserException {
		User user = userService.findUserById(userId);

		if (user != null) {
			return user;
		} else {
			throw new UserException("User not found with id: " + userId);
		}
	}

	@Override
	public List<Requirement> searchRequirements(String title, String status, String priority, Long assigneeId)
			throws RequirementException {
		List<Requirement> searchRequirements = requirementRepository.searchRequirements(title, status, priority, assigneeId);
		if (searchRequirements != null) {
			return searchRequirements;
		}
		throw new RequirementException("No Requirements found");
	}

	@Override
	public List<User> getAssigneeForRequirement(Long RequirementId) throws RequirementException {
	return null;
	}

	@Override
	public Requirement addUserToRequirement(Long RequirementId, Long userId) throws UserException, RequirementException {
		User user = userService.findUserById(userId);
		Optional<Requirement> Requirement=getRequirementById(RequirementId);

		if(Requirement.isEmpty())throw new RequirementException("Requirement not exist");

		Requirement.get().setAssignee(user);
		notifyAssignee(user.getEmail(),"New Requirement Assigned To You","New Requirement Assign To You");
		return requirementRepository.save(Requirement.get());


	}

	@Override
	public Requirement updateStatus(Long RequirementId, String status) throws RequirementException {
		Optional<Requirement> optionalRequirement= requirementRepository.findById(RequirementId);
		if(optionalRequirement.isEmpty()){
			throw new RequirementException("Requirement not found");
		}
		Requirement requirement =optionalRequirement.get();
		requirement.setStatus(status);

		return requirementRepository.save(requirement);
	}

	private void notifyAssignee(String email, String subject, String body) {
		 System.out.println("RequirementServiceImpl.notifyAssignee()");
	        notificationServiceImpl.sendNotification(email, subject, body);
	    }

}
