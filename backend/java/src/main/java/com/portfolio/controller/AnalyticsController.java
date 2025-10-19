package com.portfolio.controller;

import com.portfolio.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPortfolioStats() {
        Map<String, Object> stats = analyticsService.getPortfolioStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/skills")
    public ResponseEntity<Map<String, Object>> getSkillAnalytics() {
        Map<String, Object> analytics = analyticsService.getSkillAnalytics();
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/projects")
    public ResponseEntity<Map<String, Object>> getProjectAnalytics() {
        Map<String, Object> analytics = analyticsService.getProjectAnalytics();
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/contact")
    public ResponseEntity<Map<String, Object>> getContactAnalytics() {
        Map<String, Object> analytics = analyticsService.getContactAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
