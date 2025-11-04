package com.Dhruv.service;

import com.Dhruv.exception.MailsException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Dhruv.model.Invitation;
import com.Dhruv.repository.InviteTokenRepository;

import java.util.UUID;

@Service
public class InviteTokenServiceImpl implements InvitationService {
	@Autowired
	private InviteTokenRepository invitationRepository;

	@Autowired
	private EmailService emailService;


	public void sendInvitation(String email, Long projectId) throws MailsException, MessagingException {
		// Generate unique invitation token
		String invitationToken = UUID.randomUUID().toString();

		// Save invitation to the database
		Invitation invitation = new Invitation();
		invitation.setEmail(email);
		invitation.setProjectId(projectId);
		invitation.setToken(invitationToken);
		invitationRepository.save(invitation);


		String invitationLink = "http://localhost:5173/accept_invitation?token=" + invitationToken;
		emailService.sendEmailWithToken(email, invitationLink);

	}

	@Override
	public Invitation acceptInvitation(String token,Long userId) throws Exception {
		Invitation invitation = invitationRepository.findByToken(token);

		if (invitation == null) {
			throw new Exception("Invalid invitation token") ;
		}

		return invitation;

	}

	@Override
	public void deleteToken(String token) {
		invitationRepository.deleteByToken(token);

	}

	@Override
	public String getTokenByUserMail(String userEmail) {
	    Invitation token= invitationRepository.findByEmail(userEmail);
		return token.getToken();
	}

}
