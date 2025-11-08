package com.Dhruv.service;

import java.util.List;
import java.util.Optional;

import com.Dhruv.exception.RequirementException;
import com.Dhruv.exception.ProjectException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Requirement;
import com.Dhruv.model.User;
import com.Dhruv.request.RequirementRequest;

public interface RequirementService {
//	 List<Requirement> getAllRequirements() throws RequirementException;

	    Optional<Requirement> getRequirementById(Long RequirementId) throws RequirementException;


	List<Requirement> getRequirementByProjectId(Long projectId) throws ProjectException;
	List<Requirement> getAllRequirementsExceptUser(Long userId) throws RequirementException;


	    Requirement createRequirement(RequirementRequest Requirement, Long userid) throws UserException, RequirementException, ProjectException;

	    Optional<Requirement> updateRequirement(Long Requirementid, RequirementRequest updatedRequirement, Long userid ) throws RequirementException, UserException, ProjectException;

	    String deleteRequirement(Long RequirementId,Long userid) throws UserException, RequirementException;

	    List<Requirement> getRequirementsByAssigneeId(Long assigneeId) throws RequirementException;
	    
	    List<Requirement> searchRequirements(String title, String status, String priority, Long assigneeId) throws RequirementException;
	    
	    List<User> getAssigneeForRequirement(Long RequirementId) throws RequirementException;

	    Requirement addUserToRequirement(Long RequirementId, Long userId) throws UserException, RequirementException;

		Requirement updateStatus(Long RequirementId, String status) throws RequirementException;

}
