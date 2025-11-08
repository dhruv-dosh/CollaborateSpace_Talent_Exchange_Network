package com.Dhruv.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Dhruv.model.Chat;
import com.Dhruv.model.Project;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    

	Chat findByProject(Project projectById);
	
//	List<Chat> findByProjectNameContainingIgnoreCase(String projectName);
}

