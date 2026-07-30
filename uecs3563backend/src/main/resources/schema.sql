-- Backend Rule 3: Database Initialization with direct SQL commands to populate tables
CREATE TABLE IF NOT EXISTS knowledge_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS knowledge_document (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    view_count INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES knowledge_category(id)
);

CREATE TABLE IF NOT EXISTS knowledge_document_tags (
    document_id BIGINT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    FOREIGN KEY (document_id) REFERENCES knowledge_document(id)
);

-- Pre-populating the database tables with initial records to correspond with domain entities
INSERT INTO knowledge_category (name, description) VALUES ('IT Support FAQs', 'Common tech support resolutions');
INSERT INTO knowledge_document (category_id, title, content, status, view_count) VALUES (1, 'VPN Reset', 'Steps to reset corporate VPN', 'Approved', 150);
INSERT INTO knowledge_document (category_id, title, content, status, view_count) VALUES (1, 'System Setup', 'Drafting core workstation environment scripts', 'Draft', 5);

INSERT INTO knowledge_document_tags (document_id, tag) VALUES (1, 'VPN');
INSERT INTO knowledge_document_tags (document_id, tag) VALUES (1, 'Network');
INSERT INTO knowledge_document_tags (document_id, tag) VALUES (2, 'Setup');