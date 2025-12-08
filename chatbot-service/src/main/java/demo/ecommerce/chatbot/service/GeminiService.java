package demo.ecommerce.chatbot.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final String model;

    public GeminiService(
            @Value("${gemini.api.key:${GOOGLE_API_KEY:}}") String apiKey,
            @Value("${gemini.model:gemini-2.5-flash}") String model
    ) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("GOOGLE_API_KEY (hoặc gemini.api.key) chưa được cấu hình");
        }

        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .defaultHeader("x-goog-api-key", apiKey)
                .build();

        this.model = model;
    }

    public Mono<String> chat(String userMessage) {
        // Tạo body request theo format Gemini
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", userMessage);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        return webClient.post()
                .uri("/models/" + model + ":generateContent")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(this::extractTextFromResponse);
    }

    private String extractTextFromResponse(JsonNode response) {
        try {
            JsonNode candidates = response.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText("");
                }
            }
            return "Xin lỗi, tôi không nhận được phản hồi phù hợp từ Gemini.";
        } catch (Exception e) {
            return "Đã xảy ra lỗi khi xử lý phản hồi từ Gemini: " + e.getMessage();
        }
    }
}
