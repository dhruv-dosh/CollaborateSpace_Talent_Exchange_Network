package com.Dhruv.service;

import com.Dhruv.exception.RequirementException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Comment;
import com.Dhruv.model.Requirement;
import com.Dhruv.model.User;
import com.Dhruv.repository.CommentRepository;
import com.Dhruv.repository.RequirementRepository;
import com.Dhruv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    private CommentRepository commentRepository;
    private RequirementRepository requirementRepository;
    private UserRepository userRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository, RequirementRepository requirementRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.requirementRepository = requirementRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Comment createComment(Long RequirementId, Long userId, String content) throws UserException, RequirementException {
        Optional<Requirement> RequirementOptional = requirementRepository.findById(RequirementId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (RequirementOptional.isEmpty()){
            throw new RequirementException("Requirement not found with id "+RequirementId);
        }
        if(userOptional.isEmpty()){
            throw new UserException("user not found with id "+userId);
        }
            Requirement requirement = RequirementOptional.get();
            User user = userOptional.get();

            Comment comment = new Comment();

            comment.setRequirement(requirement);
            comment.setUser(user);
            comment.setCreatedDateTime(LocalDateTime.now());
            comment.setContent(content);

            Comment savedComment = commentRepository.save(comment);

            requirement.getComments().add(savedComment);

            return savedComment;
    }

    @Override
    public void deleteComment(Long commentId, Long userId) throws UserException, RequirementException {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (commentOptional.isEmpty()){
            throw new RequirementException("comment not found with id "+commentId);
        }
        if(userOptional.isEmpty()){
            throw new UserException("user not found with id "+userId);
        }

        Comment comment = commentOptional.get();
        User user = userOptional.get();

        if (comment.getUser().equals(user)) {
            commentRepository.delete(comment);
        } else {
            throw new UserException("User does not have permission to delete this comment!");
        }

    }

    @Override
    public List<Comment> findCommentByRequirementId(Long RequirementId) {
        return commentRepository.findByRequirementId(RequirementId);
    }
}
