# build uild Angular Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# build Spring Boot Backend JAR
FROM docker.io/library/eclipse-temurin:25-jdk-alpine AS backend-builder
WORKDIR /app/backend
COPY uecs3563backend/mvnw uecs3563backend/pom.xml ./
COPY uecs3563backend/.mvn .mvn
RUN chmod +x mvnw
COPY uecs3563backend/src src

# copy frontend build output into backend static resources directory
COPY --from=frontend-builder /app/frontend/dist/frontend/browser src/main/resources/static
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# create directory for H2 file persistence
RUN mkdir -p /app/data
VOLUME ["/app/data"]

# copy jar file
COPY --from=backend-builder /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
