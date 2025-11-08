package com.Dhruv.model;


import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String fullName;
	private String email;
	private String password;

	private String role;
	
	@JsonIgnore
	@OneToMany(mappedBy = "assignee", cascade = CascadeType.ALL)
    private List<Requirement> assignedRequirements = new ArrayList<>();


//	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
//	private Subscription subscription;

	private int projectSize=0;
	
//    @JsonIgnore
//    @ManyToMany(mappedBy = "team")
//    private List<Project> projects = new ArrayList<>();
//

}
