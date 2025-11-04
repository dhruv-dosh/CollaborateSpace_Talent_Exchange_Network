# Use Maven image to build the app
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Use JDK image to run the app
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy built jar from Maven build
COPY --from=build /app/target/*.jar app.jar

# Expose the port Spring Boot runs on
EXPOSE 5054

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
