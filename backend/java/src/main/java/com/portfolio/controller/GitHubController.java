package com.portfolio.controller;

import com.portfolio.service.GitHubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/github")
@CrossOrigin(origins = "*")
public class GitHubController {
    
    @Autowired
    private GitHubService githubService;
    
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserInfo() {
        Map<String, Object> userInfo = githubService.getUserInfo();
        return ResponseEntity.ok(userInfo);
    }
    
    @GetMapping("/repos")
    public ResponseEntity<List<Map<String, Object>>> getUserRepositories() {
        List<Map<String, Object>> repos = githubService.getUserRepositories();
        return ResponseEntity.ok(repos);
    }
    
    @GetMapping("/events")
    public ResponseEntity<List<Map<String, Object>>> getUserEvents() {
        List<Map<String, Object>> events = githubService.getUserEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getGitHubStats() {
        Map<String, Object> stats = githubService.getGitHubStats();
        return ResponseEntity.ok(stats);
    }
}
