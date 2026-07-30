package com.assignment.backend.controller;

import com.assignment.backend.model.KnowledgeDocument;
import com.assignment.backend.repository.DocumentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*") // allows Angular app running on port 4200 to connect seamlessly
// Backend Rule 2: @RestController annotation applied cleanly to expose endpoints
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    // Backend Rule 1 & 4: GET all documents with Sorting capability
    @GetMapping
    public List<KnowledgeDocument> getAllDocuments(@RequestParam(defaultValue = "title") String sortBy) {
        return documentRepository.findAll(Sort.by(sortBy).ascending());
    }

    // Backend Rule 1 & 5: Derived query driven by an HTTP Query Parameter
    @GetMapping("/search")
    public List<KnowledgeDocument> searchByStatus(@RequestParam String status) {
        return documentRepository.findByStatus(status);
    }

    // Backend Rule 1 & 5: JPQL query driven by an HTTP Path Variable
    @GetMapping("/popular/{minViews}")
    public List<KnowledgeDocument> getPopularDocs(@PathVariable Integer minViews) {
        return documentRepository.findPopularDocuments(minViews);
    }

    // Backend Rule 4: CRUD Create operation
    @PostMapping
    public ResponseEntity<KnowledgeDocument> createDocument(@Valid @RequestBody KnowledgeDocument doc) {
        return new ResponseEntity<>(documentRepository.save(doc), HttpStatus.CREATED);
    }

    // Backend Rule 4: CRUD Update operation using Path Variable
    @PutMapping("/{id}")
    public ResponseEntity<KnowledgeDocument> updateDocument(@PathVariable Long id, @Valid @RequestBody KnowledgeDocument updatedDoc) {
        return documentRepository.findById(id).map(doc -> {
            doc.setTitle(updatedDoc.getTitle());
            doc.setContent(updatedDoc.getContent());
            doc.setStatus(updatedDoc.getStatus());
            doc.setTags(updatedDoc.getTags());
            return ResponseEntity.ok(documentRepository.save(doc));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Backend Rule 4: CRUD Delete operation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeDocument> getDocumentById(@PathVariable Long id) {
    return documentRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}