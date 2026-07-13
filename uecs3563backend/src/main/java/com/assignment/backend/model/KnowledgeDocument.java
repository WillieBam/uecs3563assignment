package com.assignment.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
// Backend Rule 3: Domain class representing knowledge documents
public class KnowledgeDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is mandatory")
    private String title;
    
    @NotBlank(message = "Content is mandatory")
    private String content;
    
    private String status; 
    private Integer view_count = 0;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private KnowledgeCategory category;
}
