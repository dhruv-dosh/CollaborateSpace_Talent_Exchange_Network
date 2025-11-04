package com.Dhruv.controller;


import com.Dhruv.model.Subscription;
import com.Dhruv.repository.SubscriptionRepository;
import com.Dhruv.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dhruv.config.JwtProvider;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.User;
import com.Dhruv.repository.UserRepository;
import com.Dhruv.request.LoginRequest;
import com.Dhruv.response.AuthResponse;
import com.Dhruv.service.CustomeUserServiceImplementation;
import com.Dhruv.service.UserService;


@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private CustomeUserServiceImplementation customUserDetails;
	
	@Autowired
    private UserService userService;

	@Autowired
	private SubscriptionService subscriptionService;

	@Autowired
	private SubscriptionRepository subscriptionRepository;



	@PostMapping("/signup")
	public ResponseEntity<AuthResponse> createUserHandler(
			@RequestBody User user) throws UserException {

		// Log received data for debugging
		System.out.println("Received signup request:");
		System.out.println("Email: " + user.getEmail());
		System.out.println("Full Name: " + user.getFullName());
		System.out.println("Role: " + user.getRole());

		// Validate required fields
		if (user.getEmail() == null || user.getEmail().isEmpty()) {
			throw new UserException("Email is required");
		}
		if (user.getPassword() == null || user.getPassword().isEmpty()) {
			throw new UserException("Password is required");
		}
		if (user.getFullName() == null || user.getFullName().isEmpty()) {
			throw new UserException("Full name is required");
		}

		String email = user.getEmail();
		String password = user.getPassword();
		String fullName = user.getFullName();
		String role = user.getRole() != null ? user.getRole() : "USER";

		User isEmailExist = userRepository.findByEmail(email);

		if (isEmailExist != null) {
			throw new UserException("Email Is Already Used With Another Account");
		}

		// Create new user
		User createdUser = new User();
		createdUser.setEmail(email);
		createdUser.setFullName(fullName);
		createdUser.setPassword(passwordEncoder.encode(password));
		createdUser.setRole(role);

		User savedUser = userRepository.save(createdUser);

		Subscription subscription = subscriptionService.createSubscription(savedUser);

		Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String token = JwtProvider.generateToken(authentication);

		AuthResponse authResponse = new AuthResponse();
		authResponse.setJwt(token);
		authResponse.setMessage("Register Success");

		return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
	}

	@PostMapping("/signin")
	public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {

		String username = loginRequest.getEmail();
		String password = loginRequest.getPassword();

		System.out.println(username + " ----- " + password);

		Authentication authentication = authenticate(username, password);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String token = JwtProvider.generateToken(authentication);
		AuthResponse authResponse = new AuthResponse();

		authResponse.setMessage("Login Success");
		authResponse.setJwt(token);

		return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
	}

	private Authentication authenticate(String username, String password) {
		UserDetails userDetails = customUserDetails.loadUserByUsername(username);

		System.out.println("sign in userDetails - " + userDetails);

		if (userDetails == null) {
			System.out.println("sign in userDetails - null " + userDetails);
			throw new BadCredentialsException("Invalid username or password");
		}
		if (!passwordEncoder.matches(password, userDetails.getPassword())) {
			System.out.println("sign in userDetails - password not match " + userDetails);
			throw new BadCredentialsException("Invalid username or password");
		}
		return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	}

	
}
