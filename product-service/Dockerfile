# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/product-service-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
