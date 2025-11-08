package com.Dhruv.DTO;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


import com.Dhruv.model.Project;
import com.Dhruv.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//IssueDTO class
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequirementDTO {

 private Long id;
 private String title;
 private String description;
 private String status;
 private Long projectID;
 private String priority;
 private LocalDate dueDate;
 private List<String> tags = new ArrayList<>();
 private Project project;

 // Exclude assignee during serialization

 private User assignee;


}
