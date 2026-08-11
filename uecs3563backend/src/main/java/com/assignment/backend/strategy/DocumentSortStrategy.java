package com.assignment.backend.strategy;

import com.assignment.backend.model.KnowledgeDocument;
import java.util.List;

public interface DocumentSortStrategy {
    String getStrategyName();
    List<KnowledgeDocument> sort(List<KnowledgeDocument> documents);
}
