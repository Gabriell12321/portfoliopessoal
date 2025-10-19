package com.portfolio.controller;

import com.portfolio.dto.ContactRequest;
import com.portfolio.model.ContactMessage;
import com.portfolio.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "*")
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(@Valid @RequestBody ContactRequest request) {
        try {
            ContactMessage message = contactService.saveContactMessage(request);
            return ResponseEntity.ok(Map.of(
                "id", message.getId(),
                "status", "success",
                "message", "Mensagem enviada com sucesso!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Erro ao enviar mensagem: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactService.getAllMessages();
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<ContactMessage>> getUnreadMessages() {
        List<ContactMessage> messages = contactService.getUnreadMessages();
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/unreplied")
    public ResponseEntity<List<ContactMessage>> getUnrepliedMessages() {
        List<ContactMessage> messages = contactService.getUnrepliedMessages();
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getContactStats() {
        Long unreadCount = contactService.getUnreadCount();
        Long messagesThisMonth = contactService.getMessagesCountSince(
            LocalDateTime.now().minusMonths(1));
        
        return ResponseEntity.ok(Map.of(
            "unreadCount", unreadCount,
            "messagesThisMonth", messagesThisMonth
        ));
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id) {
        contactService.markAsRead(id);
        return ResponseEntity.ok(Map.of("status", "success"));
    }
    
    @PutMapping("/{id}/replied")
    public ResponseEntity<Map<String, String>> markAsReplied(@PathVariable Long id) {
        contactService.markAsReplied(id);
        return ResponseEntity.ok(Map.of("status", "success"));
    }
}
