package com.Dhruv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Dhruv.model.Requirement;
import com.Dhruv.model.User;

public interface RequirementRepository extends JpaRepository<Requirement, Long> {

    List<Requirement> findByAssigneeId(Long assigneeId);
	
    @Query("SELECT i FROM Requirement i " +
            "LEFT JOIN i.assignee a " +
            "WHERE (:title IS NULL OR LOWER(i.title) LIKE %:title%) " +
            "AND (:status IS NULL OR i.status = :status) " +
            "AND (:priority IS NULL OR i.priority = :priority) " +
            "AND (:assigneeId IS NULL OR a.id = :assigneeId)")
    List<Requirement> searchRequirements(
            @Param("title") String title,
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("assigneeId") Long assigneeId
    );
    
    @Query("SELECT i.assignee FROM Requirement i WHERE i.id = :RequirementId")
    List<User> findAssigneeByRequirementId(@Param("RequirementId") Long RequirementId);
    
    @Query("SELECT i FROM Requirement i LEFT JOIN FETCH i.comments WHERE i.id = :RequirementId")
    Requirement findRequirementWithComments(@Param("RequirementId") Long RequirementId);

    List<Requirement> findByProjectId(Long projectId);


}
