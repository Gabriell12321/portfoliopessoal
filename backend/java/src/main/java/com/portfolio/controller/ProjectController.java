package com.portfolio.controller;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<ProjectDTO>> getFeaturedProjects() {
        List<ProjectDTO> projects = projectService.getFeaturedProjects();
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/top")
    public ResponseEntity<List<ProjectDTO>> getTopProjects() {
        List<ProjectDTO> projects = projectService.getTopProjects();
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/language/{language}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByLanguage(@PathVariable String language) {
        List<ProjectDTO> projects = projectService.getProjectsByLanguage(language);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/tech/{tech}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByTechStack(@PathVariable String tech) {
        List<ProjectDTO> projects = projectService.getProjectsByTechStack(tech);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProjectDTO>> searchProjects(@RequestParam String q) {
        List<ProjectDTO> projects = projectService.searchProjects(q);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/languages")
    public ResponseEntity<List<String>> getAvailableLanguages() {
        List<String> languages = projectService.getAvailableLanguages();
        return ResponseEntity.ok(languages);
    }
    
    @GetMapping("/tech-stacks")
    public ResponseEntity<List<String>> getAvailableTechStacks() {
        List<String> techStacks = projectService.getAvailableTechStacks();
        return ResponseEntity.ok(techStacks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        ProjectDTO project = projectService.getProjectById(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
