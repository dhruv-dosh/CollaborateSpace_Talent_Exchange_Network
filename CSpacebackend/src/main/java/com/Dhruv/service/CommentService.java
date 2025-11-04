package com.Dhruv.service;

import com.Dhruv.exception.RequirementException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Comment;

import java.util.List;

public interface CommentService {
    Comment createComment(Long issueId,Long userId,String comment) throws UserException, RequirementException;

    void  deleteComment(Long commentId, Long userId) throws UserException, RequirementException;

//    List<Comment> findCommentByIssueId(Long issueId);

    List<Comment> findCommentByRequirementId(Long requirementId);
}
