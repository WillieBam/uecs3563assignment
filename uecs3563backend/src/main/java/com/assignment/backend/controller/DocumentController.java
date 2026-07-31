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
@CrossOrigin(origins = "*")
// Backend Rule 2: @RestController annotation applied cleanly to expose endpoints
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    // Backend Rule 1 & 4: GET documents with Team filtering and Sorting capability
    @GetMapping
    public List<KnowledgeDocument> getAllDocuments(
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestHeader(value = "X-User-Team", required = false) String headerTeam,
            @RequestParam(required = false) String team) {

        String effectiveTeam = (headerTeam != null && !headerTeam.trim().isEmpty()) ? headerTeam : team;
        if (effectiveTeam != null && !effectiveTeam.trim().isEmpty()) {
            return documentRepository.findByTeam(effectiveTeam, Sort.by(sortBy).ascending());
        }
        return documentRepository.findAll(Sort.by(sortBy).ascending());
    }

    // Backend Rule 1 & 5: Derived query driven by an HTTP Query Parameter
    @GetMapping("/search")
    public List<KnowledgeDocument> searchByStatus(
            @RequestParam String status,
            @RequestHeader(value = "X-User-Team", required = false) String userTeam) {
        if (userTeam != null && !userTeam.trim().isEmpty()) {
            return documentRepository.findByTeamAndStatus(userTeam, status);
        }
        return documentRepository.findByStatus(status);
    }

    // Backend Rule 1 & 5: JPQL query driven by an HTTP Path Variable
    @GetMapping("/popular/{minViews}")
    public List<KnowledgeDocument> getPopularDocs(@PathVariable Integer minViews) {
        return documentRepository.findPopularDocuments(minViews);
    }

    // Backend Rule 4: CRUD Create operation with automatic team assignment
    @PostMapping
    public ResponseEntity<KnowledgeDocument> createDocument(
            @Valid @RequestBody KnowledgeDocument doc,
            @RequestHeader(value = "X-User-Team", required = false) String userTeam) {

        if (doc.getTeam() == null || doc.getTeam().trim().isEmpty()) {
            if (userTeam != null && !userTeam.trim().isEmpty()) {
                doc.setTeam(userTeam);
            }
        }
        return new ResponseEntity<>(documentRepository.save(doc), HttpStatus.CREATED);
    }

    // Backend Rule 4: CRUD Update operation with team RBAC check
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(
            @PathVariable Long id,
            @Valid @RequestBody KnowledgeDocument updatedDoc,
            @RequestHeader(value = "X-User-Team", required = false) String userTeam) {

        return documentRepository.findById(id).map(doc -> {
            if (userTeam != null && !userTeam.trim().isEmpty() && doc.getTeam() != null && !doc.getTeam().equalsIgnoreCase(userTeam)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Document belongs to team " + doc.getTeam());
            }
            doc.setTitle(updatedDoc.getTitle());
            doc.setContent(updatedDoc.getContent());
            doc.setStatus(updatedDoc.getStatus());
            doc.setTags(updatedDoc.getTags());
            if (updatedDoc.getTeam() != null && !updatedDoc.getTeam().trim().isEmpty()) {
                doc.setTeam(updatedDoc.getTeam());
            }
            return ResponseEntity.ok((Object) documentRepository.save(doc));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Backend Rule 4: CRUD Delete operation with team RBAC check
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Team", required = false) String userTeam) {

        return documentRepository.findById(id).map(doc -> {
            if (userTeam != null && !userTeam.trim().isEmpty() && doc.getTeam() != null && !doc.getTeam().equalsIgnoreCase(userTeam)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Document belongs to team " + doc.getTeam());
            }
            documentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocumentById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Team", required = false) String userTeam) {

        return documentRepository.findById(id).map(doc -> {
            if (userTeam != null && !userTeam.trim().isEmpty() && doc.getTeam() != null && !doc.getTeam().equalsIgnoreCase(userTeam)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Document belongs to team " + doc.getTeam());
            }
            return ResponseEntity.ok((Object) doc);
        }).orElse(ResponseEntity.notFound().build());
    }
}