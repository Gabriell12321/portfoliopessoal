package com.portfolio.service;

import com.portfolio.model.ContactMessage;
import com.portfolio.model.Project;
import com.portfolio.model.Skill;
import com.portfolio.repository.ContactRepository;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Cacheable("portfolio-stats")
    public Map<String, Object> getPortfolioStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Estatísticas de projetos
        List<Project> projects = projectRepository.findAll();
        stats.put("totalProjects", projects.size());
        stats.put("featuredProjects", projectRepository.findByIsFeaturedTrueOrderByCreatedAtDesc().size());
        
        // Estatísticas de skills
        List<Skill> skills = skillRepository.findAllActiveSkills();
        stats.put("totalSkills", skills.size());
        stats.put("skillCategories", skillRepository.findDistinctCategories().size());
        
        // Estatísticas de contato
        stats.put("totalMessages", contactRepository.count());
        stats.put("unreadMessages", contactRepository.countUnreadMessages());
        stats.put("messagesThisMonth", contactRepository.countMessagesSince(
            LocalDateTime.now().minus(30, ChronoUnit.DAYS)));
        
        // Estatísticas de linguagens
        List<String> languages = projectRepository.findDistinctLanguages();
        stats.put("languagesUsed", languages.size());
        stats.put("topLanguages", getTopLanguages(projects));
        
        // Estatísticas de tech stack
        List<String> techStacks = projectRepository.findDistinctTechStacks();
        stats.put("techStacksUsed", techStacks.size());
        
        return stats;
    }
    
    @Cacheable("skill-analytics")
    public Map<String, Object> getSkillAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Skill> skills = skillRepository.findAllActiveSkills();
        
        // Distribuição por categoria
        Map<String, Long> categoryDistribution = skills.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                Skill::getCategory, 
                java.util.stream.Collectors.counting()));
        analytics.put("categoryDistribution", categoryDistribution);
        
        // Nível médio por categoria
        Map<String, Double> avgLevelByCategory = skills.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                Skill::getCategory,
                java.util.stream.Collectors.averagingInt(Skill::getLevel)));
        analytics.put("avgLevelByCategory", avgLevelByCategory);
        
        // Top skills por nível
        List<Skill> topSkills = skills.stream()
            .sorted((s1, s2) -> Integer.compare(s2.getLevel(), s1.getLevel()))
            .limit(10)
            .collect(java.util.stream.Collectors.toList());
        analytics.put("topSkills", topSkills);
        
        return analytics;
    }
    
    @Cacheable("project-analytics")
    public Map<String, Object> getProjectAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Project> projects = projectRepository.findAll();
        
        // Distribuição por linguagem
        Map<String, Long> languageDistribution = projects.stream()
            .filter(p -> p.getLanguage() != null)
            .collect(java.util.stream.Collectors.groupingBy(
                Project::getLanguage,
                java.util.stream.Collectors.counting()));
        analytics.put("languageDistribution", languageDistribution);
        
        // Projetos mais populares
        List<Project> popularProjects = projectRepository.findTopProjects();
        analytics.put("popularProjects", popularProjects);
        
        // Estatísticas de GitHub
        int totalStars = projects.stream()
            .mapToInt(p -> p.getStars() != null ? p.getStars() : 0)
            .sum();
        int totalForks = projects.stream()
            .mapToInt(p -> p.getForks() != null ? p.getForks() : 0)
            .sum();
        
        analytics.put("totalStars", totalStars);
        analytics.put("totalForks", totalForks);
        
        return analytics;
    }
    
    @Cacheable("contact-analytics")
    public Map<String, Object> getContactAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Mensagens por período
        LocalDateTime now = LocalDateTime.now();
        analytics.put("messagesToday", contactRepository.countMessagesSince(now.minusDays(1)));
        analytics.put("messagesThisWeek", contactRepository.countMessagesSince(now.minusWeeks(1)));
        analytics.put("messagesThisMonth", contactRepository.countMessagesSince(now.minusMonths(1)));
        
        // Taxa de resposta
        long totalMessages = contactRepository.count();
        long repliedMessages = contactRepository.findByIsRepliedTrue().size();
        double responseRate = totalMessages > 0 ? (double) repliedMessages / totalMessages * 100 : 0;
        analytics.put("responseRate", Math.round(responseRate * 100.0) / 100.0);
        
        return analytics;
    }
    
    private Map<String, Long> getTopLanguages(List<Project> projects) {
        return projects.stream()
            .filter(p -> p.getLanguage() != null)
            .collect(java.util.stream.Collectors.groupingBy(
                Project::getLanguage,
                java.util.stream.Collectors.counting()))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(5)
            .collect(java.util.stream.Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (e1, e2) -> e1,
                java.util.LinkedHashMap::new));
    }
}
