# Stage 1: Build Angular app
FROM node:16.14.2 as frontend

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the frontend application code
COPY frontend .

# Build the Angular app
RUN npm run build --prod


# Stage 2: Build Java backend with Maven
FROM maven:3.8.4-openjdk-11 as backend

# Set the working directory for the backend
WORKDIR /app/backend

# Copy pom.xml
COPY backend/pom.xml ./

# Install dependencies
RUN mvn dependency:go-offline -B

# Copy the backend source code
COPY backend/src ./src

# Build the Java backend
RUN mvn package -DskipTests


# Stage 3: Combine frontend and backend
FROM openjdk:11-jre-slim

# Set the working directory
WORKDIR /app

# Copy the built frontend files
COPY --from=frontend /app/frontend/dist ./frontend/dist

# Copy the built backend JAR file
COPY --from=backend /app/backend/target/backend.jar ./

# Expose port 8080 for the backend
EXPOSE 8080

# Set the entry point for the backend
ENTRYPOINT ["java", "-jar", "backend.jar"]
