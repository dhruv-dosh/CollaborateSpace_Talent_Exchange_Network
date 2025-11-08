package com.Dhruv.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateChat {

	private Long projectId;
	
	private List<Long> userIds;
}
