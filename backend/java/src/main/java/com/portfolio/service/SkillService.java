package com.portfolio.service;

import com.portfolio.model.Skill;
import com.portfolio.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SkillService {
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Cacheable("all-skills")
    public List<Skill> getAllSkills() {
        return skillRepository.findAllActiveSkills();
    }
    
    @Cacheable("skills-by-category")
    public List<Skill> getSkillsByCategory(String category) {
        return skillRepository.findByCategoryOrderByLevelDesc(category);
    }
    
    @Cacheable("skill-categories")
    public List<String> getSkillCategories() {
        return skillRepository.findDistinctCategories();
    }
    
    @Cacheable("skills-by-level")
    public List<Skill> getSkillsByMinLevel(Integer minLevel) {
        return skillRepository.findByLevelGreaterThanEqualOrderByLevelDesc(minLevel);
    }
    
    public Map<String, List<Skill>> getSkillsGroupedByCategory() {
        return getAllSkills()
                .stream()
                .collect(Collectors.groupingBy(Skill::getCategory));
    }
    
    public List<Skill> getTopSkills(Integer limit) {
        return getAllSkills()
                .stream()
                .sorted((s1, s2) -> Integer.compare(s2.getLevel(), s1.getLevel()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
