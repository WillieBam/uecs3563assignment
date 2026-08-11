package com.assignment.backend.strategy;

import com.assignment.backend.model.KnowledgeDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DocumentSortContext {

    private final Map<String, DocumentSortStrategy> strategyMap = new HashMap<>();

    @Autowired
    public DocumentSortContext(List<DocumentSortStrategy> strategies) {
        if (strategies != null) {
            for (DocumentSortStrategy strategy : strategies) {
                strategyMap.put(strategy.getStrategyName().toLowerCase(), strategy);
            }
        }
    }

    public List<KnowledgeDocument> executeSort(String strategyName, List<KnowledgeDocument> documents) {
        String key = (strategyName != null && !strategyName.trim().isEmpty()) ? strategyName.trim().toLowerCase() : "title";
        DocumentSortStrategy strategy = strategyMap.getOrDefault(key, strategyMap.get("title"));
        if (strategy == null && !strategyMap.isEmpty()) {
            strategy = strategyMap.values().iterator().next();
        }
        if (strategy != null) {
            return strategy.sort(documents);
        }
        return documents;
    }
}
