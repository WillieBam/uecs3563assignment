package com.assignment.backend.repository;

import com.assignment.backend.model.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

// Backend Rule 4: Extending JpaRepository for basic CRUD and built-in Sorting capabilities
public interface DocumentRepository extends JpaRepository<KnowledgeDocument, Long> {
    
    // Backend Rule 5: Derived Query based on method naming convention
    List<KnowledgeDocument> findByStatus(String status);

    // Backend Rule 5: Custom JPQL Query mapping complex query logic using parameters
    @Query("SELECT d FROM KnowledgeDocument d WHERE d.view_count >= :minViews")
    List<KnowledgeDocument> findPopularDocuments(@Param("minViews") Integer minViews);
}
