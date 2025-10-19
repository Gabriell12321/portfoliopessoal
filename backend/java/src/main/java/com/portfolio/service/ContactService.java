package com.portfolio.service;

import com.portfolio.dto.ContactRequest;
import com.portfolio.model.ContactMessage;
import com.portfolio.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Transactional
    public ContactMessage saveContactMessage(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());
        message.setSubject(request.getSubject());
        message.setPhone(request.getPhone());
        
        ContactMessage savedMessage = contactRepository.save(message);
        
        // Enviar email de notificação
        emailService.sendContactNotification(savedMessage);
        
        return savedMessage;
    }
    
    public List<ContactMessage> getAllMessages() {
        return contactRepository.findAllOrderByCreatedAtDesc();
    }
    
    public List<ContactMessage> getUnreadMessages() {
        return contactRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }
    
    public List<ContactMessage> getUnrepliedMessages() {
        return contactRepository.findByIsRepliedFalseOrderByCreatedAtDesc();
    }
    
    public Long getUnreadCount() {
        return contactRepository.countUnreadMessages();
    }
    
    public Long getMessagesCountSince(LocalDateTime since) {
        return contactRepository.countMessagesSince(since);
    }
    
    @Transactional
    public void markAsRead(Long messageId) {
        contactRepository.findById(messageId).ifPresent(message -> {
            message.setIsRead(true);
            contactRepository.save(message);
        });
    }
    
    @Transactional
    public void markAsReplied(Long messageId) {
        contactRepository.findById(messageId).ifPresent(message -> {
            message.setIsReplied(true);
            contactRepository.save(message);
        });
    }
    
    public List<ContactMessage> getMessagesByDateRange(LocalDateTime start, LocalDateTime end) {
        return contactRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
    }
}
