package demo.ecommerce.chatbot.controller;

import demo.ecommerce.chatbot.model.ChatRequest;
import demo.ecommerce.chatbot.model.ChatResponse;
import demo.ecommerce.chatbot.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final OpenAIService openAIService;

    @Autowired
    public ChatController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping
    public Mono<ChatResponse> chat(@RequestBody ChatRequest request) {
        return openAIService.ask(request.getMessage())
                .map(ChatResponse::new);
    }

    // Endpoint test nhanh
    @GetMapping("/ping")
    public Mono<String> ping() {
        return Mono.just("chatbot-service is up");
    }
}
