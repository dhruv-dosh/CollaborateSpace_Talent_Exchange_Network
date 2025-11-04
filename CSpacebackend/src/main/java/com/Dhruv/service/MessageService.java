package com.Dhruv.service;

import java.util.List;

import com.Dhruv.exception.ChatException;
import com.Dhruv.exception.ProjectException;
import com.Dhruv.exception.UserException;
import com.Dhruv.model.Message;

public interface MessageService {

    Message sendMessage(Long senderId, Long chatId, String content) throws UserException, ChatException, ProjectException;

    List<Message> getMessagesByProjectId(Long projectId) throws ProjectException, ChatException;

    void deleteMessagesByProjectId(Long projectId) throws ProjectException, ChatException;
}

