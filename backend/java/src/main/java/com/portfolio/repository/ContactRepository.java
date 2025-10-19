package com.portfolio.repository;

import com.portfolio.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
    
    List<ContactMessage> findByIsReadFalseOrderByCreatedAtDesc();
    
    List<ContactMessage> findByIsRepliedFalseOrderByCreatedAtDesc();
    
    List<ContactMessage> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(c) FROM ContactMessage c WHERE c.isRead = false")
    Long countUnreadMessages();
    
    @Query("SELECT COUNT(c) FROM ContactMessage c WHERE c.createdAt >= :since")
    Long countMessagesSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT c FROM ContactMessage c ORDER BY c.createdAt DESC")
    List<ContactMessage> findAllOrderByCreatedAtDesc();
}
