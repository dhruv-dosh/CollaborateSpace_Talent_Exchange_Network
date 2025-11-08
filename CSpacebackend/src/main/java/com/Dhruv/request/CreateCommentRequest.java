package com.Dhruv.request;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private Long RequirementId;
    private String content;
}
