package demo.ecommerce.chatbot.controller;

import demo.ecommerce.chatbot.model.ChatRequest;
import demo.ecommerce.chatbot.service.GeminiService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public Mono<String> chat(@RequestBody ChatRequest request) {
        return geminiService.chat(request.getMessage());
    }
}
