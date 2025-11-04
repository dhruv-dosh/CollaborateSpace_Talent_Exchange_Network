package com.Dhruv.controller;



import java.util.List;

import com.Dhruv.model.Project;
import com.Dhruv.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Dhruv.exception.ChatException;
import com.Dhruv.exception.ProjectException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Chat;
import com.Dhruv.model.Message;
import com.Dhruv.model.User;
import com.Dhruv.request.CreateMessageRequest;
import com.Dhruv.service.MessageService;
import com.Dhruv.service.ProjectService;
import com.Dhruv.service.UserService;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;




    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody CreateMessageRequest request)
            throws UserException, ChatException, ProjectException {
        
        User user = userService.findUserById(request.getSenderId());  
        if(user==null) throw new UserException("user Not found with id "+request.getSenderId());
        Chat chats = projectService.getProjectById(request.getProjectId()).getChat();  // This method should throw ChatException if the chat is not found
        if(chats==null) throw new ChatException("Chats not found");
        Message sentMessage = messageService.sendMessage(request.getSenderId(), request.getProjectId(), request.getContent());
        return ResponseEntity.ok(sentMessage);
    }

    @GetMapping("/chat/{projectId}")
    public ResponseEntity<List<Message>> getMessagesByChatId(@PathVariable Long projectId)
            throws ProjectException, ChatException {
        List<Message> messages = messageService.getMessagesByProjectId(projectId);
        return ResponseEntity.ok(messages);
    }
    @DeleteMapping("/chat/{projectId}")
    public ResponseEntity<MessageResponse> deleteAllMessages(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String token)
            throws UserException, ProjectException, ChatException {

        User user = userService.findUserProfileByJwt(token);
        Project project = projectService.getProjectById(projectId);

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new ProjectException("Only project owner can delete chat history");
        }

        messageService.deleteMessagesByProjectId(projectId);

        MessageResponse res = new MessageResponse();
        res.setMessage("Chat history deleted successfully");
        return ResponseEntity.ok(res);
    }

}

