package com.portfolio.repository;

import com.portfolio.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    
    List<Skill> findByCategoryOrderByLevelDesc(String category);
    
    List<Skill> findByIsActiveTrueOrderByCategoryAscLevelDesc();
    
    List<Skill> findByLevelGreaterThanEqualOrderByLevelDesc(Integer minLevel);
    
    @Query("SELECT DISTINCT s.category FROM Skill s WHERE s.isActive = true")
    List<String> findDistinctCategories();
    
    @Query("SELECT s FROM Skill s WHERE s.isActive = true ORDER BY s.category, s.level DESC")
    List<Skill> findAllActiveSkills();
}
