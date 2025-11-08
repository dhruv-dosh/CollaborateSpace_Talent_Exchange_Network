package com.Dhruv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Dhruv.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long>{
	 List<Message> findByChatIdOrderByCreatedAtAsc(Long chatId);
//	List<Message> findByProjectIdOrderByCreatedAtAsc(Long projectId);
}
