package com.Dhruv.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Label {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    private String color;

    private String description;

    private LocalDateTime creationDate;

    // Assuming you have a User entity for creator association
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    private int usageCount;

    private boolean isVisible;

    // Assuming bidirectional relationship is not required for now
    // @ManyToMany(mappedBy = "labels")
    // private Set<Issue> associatedIssues = new HashSet<>();
}
