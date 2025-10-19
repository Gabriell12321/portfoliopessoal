package com.portfolio.dto;

import com.portfolio.model.Project;
import java.time.LocalDateTime;

public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private String githubUrl;
    private String techStack;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer stars;
    private Integer forks;
    private String language;
    private Boolean isFeatured;
    
    // Constructors
    public ProjectDTO() {}
    
    public ProjectDTO(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.githubUrl = project.getGithubUrl();
        this.techStack = project.getTechStack();
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();
        this.stars = project.getStars();
        this.forks = project.getForks();
        this.language = project.getLanguage();
        this.isFeatured = project.getIsFeatured();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getGithubUrl() {
        return githubUrl;
    }
    
    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }
    
    public String getTechStack() {
        return techStack;
    }
    
    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Integer getStars() {
        return stars;
    }
    
    public void setStars(Integer stars) {
        this.stars = stars;
    }
    
    public Integer getForks() {
        return forks;
    }
    
    public void setForks(Integer forks) {
        this.forks = forks;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public Boolean getIsFeatured() {
        return isFeatured;
    }
    
    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }
}
