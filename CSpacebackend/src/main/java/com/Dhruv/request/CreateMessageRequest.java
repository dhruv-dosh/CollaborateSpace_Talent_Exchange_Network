package com.Dhruv.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateMessageRequest {

	private Long senderId;
	private Long projectId;
	private String content;
}
