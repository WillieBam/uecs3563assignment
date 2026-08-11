package com.assignment.backend.strategy;

import com.assignment.backend.model.KnowledgeDocument;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class TagsSortStrategy implements DocumentSortStrategy {

    @Override
    public String getStrategyName() {
        return "tags";
    }

    @Override
    public List<KnowledgeDocument> sort(List<KnowledgeDocument> documents) {
        if (documents == null) {
            return new ArrayList<>();
        }
        List<KnowledgeDocument> sortedList = new ArrayList<>(documents);
        sortedList.sort(Comparator.comparing(doc -> {
            if (doc.getTags() == null || doc.getTags().isEmpty()) {
                return "";
            }
            return String.join(",", doc.getTags()).toLowerCase();
        }));
        return sortedList;
    }
}
