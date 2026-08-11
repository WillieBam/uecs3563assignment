package com.assignment.backend.strategy;

import com.assignment.backend.model.KnowledgeDocument;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DocumentSortStrategyTest {

    private TitleSortStrategy titleSortStrategy;
    private StatusSortStrategy statusSortStrategy;
    private TagsSortStrategy tagsSortStrategy;
    private DocumentSortContext sortContext;

    private KnowledgeDocument doc1;
    private KnowledgeDocument doc2;
    private KnowledgeDocument doc3;

    @BeforeEach
    void setUp() {
        titleSortStrategy = new TitleSortStrategy();
        statusSortStrategy = new StatusSortStrategy();
        tagsSortStrategy = new TagsSortStrategy();
        sortContext = new DocumentSortContext(List.of(titleSortStrategy, statusSortStrategy, tagsSortStrategy));

        doc1 = new KnowledgeDocument(1L, "Zebra Document", "Content 1", "Draft", 10, "IT Support", null, List.of("network", "hardware"));
        doc2 = new KnowledgeDocument(2L, "Apple Guide", "Content 2", "Approved", 50, "IT Support", null, List.of("software"));
        doc3 = new KnowledgeDocument(3L, "Banana SOP", "Content 3", "Approved", 20, "IT Support", null, List.of("api", "backend"));
    }

    @Test
    void testTitleSortStrategy() {
        List<KnowledgeDocument> sorted = titleSortStrategy.sort(List.of(doc1, doc2, doc3));
        assertEquals("Apple Guide", sorted.get(0).getTitle());
        assertEquals("Banana SOP", sorted.get(1).getTitle());
        assertEquals("Zebra Document", sorted.get(2).getTitle());
    }

    @Test
    void testStatusSortStrategy() {
        List<KnowledgeDocument> sorted = statusSortStrategy.sort(List.of(doc1, doc2, doc3));
        assertEquals("Approved", sorted.get(0).getStatus());
        assertEquals("Approved", sorted.get(1).getStatus());
        assertEquals("Draft", sorted.get(2).getStatus());
    }

    @Test
    void testTagsSortStrategy() {
        List<KnowledgeDocument> sorted = tagsSortStrategy.sort(List.of(doc1, doc2, doc3));
        // "api,backend" comes before "network,hardware" and "software"
        assertEquals("Banana SOP", sorted.get(0).getTitle());
        assertEquals("Zebra Document", sorted.get(1).getTitle());
        assertEquals("Apple Guide", sorted.get(2).getTitle());
    }

    @Test
    void testDocumentSortContext() {
        List<KnowledgeDocument> sortedByTitle = sortContext.executeSort("title", List.of(doc1, doc2, doc3));
        assertEquals("Apple Guide", sortedByTitle.get(0).getTitle());

        List<KnowledgeDocument> sortedByStatus = sortContext.executeSort("status", List.of(doc1, doc2, doc3));
        assertEquals("Approved", sortedByStatus.get(0).getStatus());

        List<KnowledgeDocument> sortedByTags = sortContext.executeSort("tags", List.of(doc1, doc2, doc3));
        assertEquals("Banana SOP", sortedByTags.get(0).getTitle());
    }
}
