package com.Dhruv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDto {
	
	private String title;
	private String imageUrl;
	private String description;
	private Long id;

}
