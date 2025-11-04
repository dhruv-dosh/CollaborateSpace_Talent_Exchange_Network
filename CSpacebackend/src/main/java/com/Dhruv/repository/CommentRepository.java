package com.Dhruv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Dhruv.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findByRequirementId(Long RequirementId);
}

