package com.Dhruv.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenValidationRequest {
    private String token;
    private String userEmail;
    private Long projectId;

   
}

