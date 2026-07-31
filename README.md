# Knowledge Management System (KMS)

A web-based Knowledge Management System built with Angular and Spring Boot, featuring **Team-based Role-Based Access Control (Team RBAC)** to secure knowledge documents across teams.

---

## Tech Stack Overview

### Frontend
- **Framework**: Angular 18+ (Standalone Components architecture)
- **State Management & Logic**: Angular Signals (`signal<Document[]>`), RxJS Observables, Reactive Forms (`FormGroup`, `FormArray`, `Validators`)
- **Routing**: Angular Router with route protection via `AuthGuard` (`canActivate`), nested preview/edit child routes, and programmatic navigation
- **Styling**: Vanilla CSS with modern UI layouts and custom badges

### Backend
- **Framework**: Java 25 / Spring Boot 3
- **Architecture**: Layered architecture with `@RestController`, Service/Repository abstraction, and DTO handling
- **Persistence & ORM**: Spring Data JPA with custom derived queries and JPQL (`@Query`)
- **Validation & Security**: Jakarta Validation (`@Valid`, `@NotBlank`), Custom header-based Team Authorization (`X-User-Team`)
- **Build Tool**: Apache Maven (`./mvnw`)

### Database
- **Database Engine**: **H2 Embedded Database** (File-based persistence stored at `uecs3563backend/data/kmsdb`)
- **Initialization**: Automatic schema generation and seed data migration using `schema.sql`

---

## Environment Configuration (`.env`)

Create a **`.env`** file in the `uecs3563backend` directory to store database connection variables:

Create `.env`:
```properties
# Database Configuration Profile
H2DB_URL=<h2dburl>
H2DB_USERNAME=<username>
H2DB_PASSWORD=<password>
```

---

## Demo User Credentials (Team RBAC)

The system includes pre-populated demo user accounts in `schema.sql` to demonstrate team-isolated knowledge management:

| Username | Password | Team | Access Scope |
| :--- | :--- | :--- | :--- |
| `alice` | `password123` | **IT Support** | Can view, create, edit, and delete IT Support documents only |
| `bob` | `password123` | **HR** | Can view, create, edit, and delete HR documents only |
| `charlie` | `password123` | **Engineering** | Can view, create, edit, and delete Engineering documents only |

### Access Control Rules:
- Members of a team can only access documents owned by their assigned team.
- Creating a new document automatically assigns it to the logged-in user's team.
- Direct cross-team actions (viewing, editing, or deleting documents outside one's team) are blocked by backend authorization checks (`403 Forbidden`).

---

##  How to Start the Application

### Option 1: Containerized Deployment with `--env-file` (Recommended & Easiest)

Using **Podman** or **Docker**, pass the `.env` file directly using `--env-file .env`:

#### Using Docker:
```bash
# 1. Build the Docker container image
docker build -t kms-app:v1 .

# 2. Run the container with .env file
docker run -d --env-file ./uecs3563backend/.env  -p 8080:8080 --name kms-service kms-app:v1
```

#### Using Docker Compose:
```bash
docker compose up --build -d
```

---

### Option 2: Integrated Local Server Mode

Prerequisites:
- Java JDK 17+ (or JDK 25)
- Node.js 18+ and npm
- Configured `.env` file

1. Navigate to the backend directory:
   ```bash
   cd uecs3563backend
   ```
2. Start the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:8080/
   ```

---

## H2 Database Console Access

You can inspect the database tables (`app_users`, `knowledge_document`, `knowledge_document_tags`, `knowledge_category`) via the built-in H2 Console:

- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:file:./data/kmsdb`
- **Username**: Value set in `H2DB_USERNAME` (e.g. `meilin`)
- **Password**: Value set in `H2DB_PASSWORD` (e.g. `meilin`)
