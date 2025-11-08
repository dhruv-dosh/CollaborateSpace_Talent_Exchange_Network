package com.Dhruv.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.Dhruv.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	public User findByEmail(String email);

}
