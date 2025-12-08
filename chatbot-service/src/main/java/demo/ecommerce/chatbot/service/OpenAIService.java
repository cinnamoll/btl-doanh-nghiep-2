package demo.ecommerce.chatbot.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private final WebClient webClient;
    private final String model;
    private final Integer maxTokens;

    public OpenAIService() {
        String apiKey = System.getenv("OPENAI_API_KEY");

        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        this.model = "gpt-4o-mini";
        this.maxTokens = 200;
    }

    public Mono<String> ask(String userMessage) {

        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content",
                "Bạn là trợ lý ảo trong hệ thống ecommerce. " +
                        "Hãy trả lời ngắn gọn, thân thiện và ưu tiên tiếng Việt.");

        Map<String, Object> user = new HashMap<>();
        user.put("role", "user");
        user.put("content", userMessage);

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", List.of(systemMessage, user));
        body.put("max_tokens", maxTokens);

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> json.path("choices")
                        .get(0)
                        .path("message")
                        .path("content")
                        .asText("Xin lỗi, hiện tại tôi không thể trả lời."))
                .onErrorResume(ex -> Mono.just("Lỗi gọi OpenAI: " + ex.getMessage()));
    }
}
