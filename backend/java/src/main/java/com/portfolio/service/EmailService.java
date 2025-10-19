package com.portfolio.service;

import com.portfolio.model.ContactMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${portfolio.email.from}")
    private String fromEmail;
    
    @Value("${portfolio.email.to}")
    private String toEmail;
    
    @Async
    public void sendContactNotification(ContactMessage message) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(fromEmail);
            email.setTo(toEmail);
            email.setSubject("Nova mensagem de contato - " + message.getName());
            
            StringBuilder body = new StringBuilder();
            body.append("Nova mensagem recebida no portfólio:\n\n");
            body.append("Nome: ").append(message.getName()).append("\n");
            body.append("Email: ").append(message.getEmail()).append("\n");
            if (message.getPhone() != null && !message.getPhone().isEmpty()) {
                body.append("Telefone: ").append(message.getPhone()).append("\n");
            }
            if (message.getSubject() != null && !message.getSubject().isEmpty()) {
                body.append("Assunto: ").append(message.getSubject()).append("\n");
            }
            body.append("\nMensagem:\n").append(message.getMessage()).append("\n\n");
            body.append("Data: ").append(message.getCreatedAt()).append("\n");
            
            email.setText(body.toString());
            
            mailSender.send(email);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email: " + e.getMessage());
        }
    }
    
    @Async
    public void sendAutoReply(ContactMessage message) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(fromEmail);
            email.setTo(message.getEmail());
            email.setSubject("Confirmação de recebimento - Gabriel Garcia");
            
            StringBuilder body = new StringBuilder();
            body.append("Olá ").append(message.getName()).append(",\n\n");
            body.append("Obrigado por entrar em contato! Recebi sua mensagem e responderei em breve.\n\n");
            body.append("Aqui está um resumo da sua mensagem:\n");
            body.append("Assunto: ").append(message.getSubject() != null ? message.getSubject() : "Contato via portfólio").append("\n");
            body.append("Mensagem: ").append(message.getMessage()).append("\n\n");
            body.append("Atenciosamente,\n");
            body.append("Gabriel Garcia\n");
            body.append("Desenvolvedor Full Stack");
            
            email.setText(body.toString());
            
            mailSender.send(email);
        } catch (Exception e) {
            System.err.println("Erro ao enviar auto-resposta: " + e.getMessage());
        }
    }
}
