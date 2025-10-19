package com.portfolio.service;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.model.Project;
import com.portfolio.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Cacheable("projects")
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }
    
    @Cacheable("featured-projects")
    public List<ProjectDTO> getFeaturedProjects() {
        return projectRepository.findByIsFeaturedTrueOrderByCreatedAtDesc()
                .stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }
    
    @Cacheable("projects-by-language")
    public List<ProjectDTO> getProjectsByLanguage(String language) {
        return projectRepository.findByLanguageOrderByStarsDesc(language)
                .stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }
    
    @Cacheable("projects-by-tech")
    public List<ProjectDTO> getProjectsByTechStack(String tech) {
        return projectRepository.findByTechStackContaining(tech)
                .stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }
    
    @Cacheable("top-projects")
    public List<ProjectDTO> getTopProjects() {
        return projectRepository.findTopProjects()
                .stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }
    
    public List<String> getAvailableLanguages() {
        return projectRepository.findDistinctLanguages();
    }
    
    public List<String> getAvailableTechStacks() {
        return projectRepository.findDistinctTechStacks();
    }
    
    public ProjectDTO getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(ProjectDTO::new)
                .orElse(null);
    }
    
    public List<ProjectDTO> searchProjects(String query) {
        return projectRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }
}
