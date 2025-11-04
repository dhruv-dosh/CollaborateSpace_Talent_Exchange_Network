package com.Dhruv.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Dhruv.model.User;
import com.Dhruv.repository.UserRepository;

@Service
public class CustomeUserServiceImplementation implements UserDetailsService {
	
private UserRepository userRepository;
	
	public CustomeUserServiceImplementation(UserRepository userRepository) {
		this.userRepository=userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		User user = userRepository.findByEmail(username);
		
		if(user==null) {

			throw new UsernameNotFoundException("user not found with email  - "+username);
		}
		
		String role=user.getRole();
		
		if(role==null) role="CUSTOMER";
		
		List<GrantedAuthority> authorities=new ArrayList<>();
		
		authorities.add(new SimpleGrantedAuthority(role));
		
		return new org.springframework.security.core.userdetails.User(
				user.getEmail(),user.getPassword(),authorities);
	}


}
