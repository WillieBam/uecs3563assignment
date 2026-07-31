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
    team VARCHAR(100),
    FOREIGN KEY (category_id) REFERENCES knowledge_category(id)
);

-- Migration support for existing database files: ensure team column exists
ALTER TABLE knowledge_document ADD COLUMN IF NOT EXISTS team VARCHAR(100);

CREATE TABLE IF NOT EXISTS knowledge_document_tags (
    document_id BIGINT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    FOREIGN KEY (document_id) REFERENCES knowledge_document(id)
);

CREATE TABLE IF NOT EXISTS app_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    team VARCHAR(100) NOT NULL
);

-- Pre-populating users for Team RBAC
MERGE INTO app_users (id, username, password, team) KEY(id) VALUES (1, 'alice', 'password123', 'IT Support');
MERGE INTO app_users (id, username, password, team) KEY(id) VALUES (2, 'bob', 'password123', 'HR');
MERGE INTO app_users (id, username, password, team) KEY(id) VALUES (3, 'charlie', 'password123', 'Engineering');

-- Pre-populating the database tables with initial records to correspond with domain entities
MERGE INTO knowledge_category (id, name, description) KEY(id) VALUES (1, 'IT Support FAQs', 'Common tech support resolutions');
MERGE INTO knowledge_category (id, name, description) KEY(id) VALUES (2, 'HR Policies', 'Human resource guidelines');

MERGE INTO knowledge_document (id, category_id, title, content, status, view_count, team) KEY(id) VALUES (1, 1, 'VPN Reset', 'Steps to reset corporate VPN', 'Approved', 150, 'IT Support');
MERGE INTO knowledge_document (id, category_id, title, content, status, view_count, team) KEY(id) VALUES (2, 1, 'System Setup', 'Drafting core workstation environment scripts', 'Draft', 5, 'IT Support');
MERGE INTO knowledge_document (id, category_id, title, content, status, view_count, team) KEY(id) VALUES (3, 2, 'Leave Request Guide', 'How to apply for annual leave via portal', 'Approved', 45, 'HR');

MERGE INTO knowledge_document_tags (document_id, tag) KEY(document_id, tag) VALUES (1, 'VPN');
MERGE INTO knowledge_document_tags (document_id, tag) KEY(document_id, tag) VALUES (1, 'Network');
MERGE INTO knowledge_document_tags (document_id, tag) KEY(document_id, tag) VALUES (2, 'Setup');
MERGE INTO knowledge_document_tags (document_id, tag) KEY(document_id, tag) VALUES (3, 'HR');
MERGE INTO knowledge_document_tags (document_id, tag) KEY(document_id, tag) VALUES (3, 'Leave');

-- Reset AUTO_INCREMENT sequence counter to avoid primary key collisions with seed data (id 1, 2, 3)
ALTER TABLE knowledge_document ALTER COLUMN id RESTART WITH 100;
ALTER TABLE app_users ALTER COLUMN id RESTART WITH 100;
ALTER TABLE knowledge_category ALTER COLUMN id RESTART WITH 100;