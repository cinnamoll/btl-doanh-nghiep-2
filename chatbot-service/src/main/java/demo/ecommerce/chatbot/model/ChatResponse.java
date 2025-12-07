package demo.ecommerce.chatbot.model;

public class ChatResponse {

    private String answer;

    public ChatResponse() {
    }

    public ChatResponse(String reply) {
        this.answer = reply;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
