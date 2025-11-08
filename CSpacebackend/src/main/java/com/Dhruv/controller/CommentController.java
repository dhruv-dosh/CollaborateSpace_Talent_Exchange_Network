package com.Dhruv.controller;

import com.Dhruv.exception.RequirementException;
import com.Dhruv.exception.ProjectException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Comment;
import com.Dhruv.model.User;
import com.Dhruv.request.CreateCommentRequest;
import com.Dhruv.response.MessageResponse;
import com.Dhruv.service.CommentService;
import com.Dhruv.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private CommentService commentService;
    private UserService userService;

    @Autowired
    public CommentController(CommentService commentService,UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

    @PostMapping()
    public ResponseEntity<Comment> createComment(

            @RequestBody CreateCommentRequest req,
            @RequestHeader("Authorization") String jwt) throws UserException, RequirementException, ProjectException {
        User user = userService.findUserProfileByJwt(jwt);
        Comment createdComment = commentService.createComment(req.getRequirementId(), user.getId(), req.getContent());
        return new ResponseEntity<>(createdComment,HttpStatus.CREATED);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<MessageResponse> deleteComment(@PathVariable Long commentId,

                                                         @RequestHeader("Authorization") String jwt) throws UserException, RequirementException, ProjectException {
        User user = userService.findUserProfileByJwt(jwt);
        commentService.deleteComment(commentId, user.getId());
        MessageResponse res=new MessageResponse();
        res.setMessage("comment deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/{RequirementId}")
    public ResponseEntity<List<Comment>>  getCommentsByRequirementId(@PathVariable Long RequirementId) {
        List<Comment> comments = commentService.findCommentByRequirementId(RequirementId);
        return new ResponseEntity<>(comments,HttpStatus.OK);
    }
}
