FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY target/chatbot-service-1.0.0.jar app.jar

EXPOSE 8095

ENV OPENAI_API_KEY=YOUR_KEY_HERE

ENTRYPOINT ["java", "-jar", "app.jar"]
