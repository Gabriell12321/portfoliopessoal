package com.portfolio.controller;

import com.portfolio.model.Skill;
import com.portfolio.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/skills")
@CrossOrigin(origins = "*")
public class SkillController {
    
    @Autowired
    private SkillService skillService;
    
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getSkillCategories() {
        List<String> categories = skillService.getSkillCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Skill>> getSkillsByCategory(@PathVariable String category) {
        List<Skill> skills = skillService.getSkillsByCategory(category);
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/level/{minLevel}")
    public ResponseEntity<List<Skill>> getSkillsByMinLevel(@PathVariable Integer minLevel) {
        List<Skill> skills = skillService.getSkillsByMinLevel(minLevel);
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<Skill>>> getSkillsGroupedByCategory() {
        Map<String, List<Skill>> groupedSkills = skillService.getSkillsGroupedByCategory();
        return ResponseEntity.ok(groupedSkills);
    }
    
    @GetMapping("/top")
    public ResponseEntity<List<Skill>> getTopSkills(@RequestParam(defaultValue = "10") Integer limit) {
        List<Skill> topSkills = skillService.getTopSkills(limit);
        return ResponseEntity.ok(topSkills);
    }
}
