package com.Dhruv.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Dhruv.model.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
	PasswordResetToken findByToken(String token);
}
