package demo.ecommerce.chatbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

/**
 * Chatbot Service Application
 */
@SpringBootApplication
@ComponentScan({"demo.ecommerce"})
public class Application {

    /**
     * Định nghĩa các endpoint PUBLIC (không cần auth) nếu muốn.
     * Nếu bạn muốn chatbot mở cho tất cả mọi người:
     *   return new String[]{"/chat/**"};
     * Nếu muốn bắt buộc login thì để rỗng như các service khác.
     */
    @Bean
    public String[] publicEndpoints() {
        // Cho phép public chatbot:
        return new String[]{"/chat/**"};

        // Nếu muốn secure toàn bộ:
        // return new String[]{};
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
