package com.portfolio.repository;

import com.portfolio.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByIsFeaturedTrueOrderByCreatedAtDesc();
    
    List<Project> findByLanguageOrderByStarsDesc(String language);
    
    List<Project> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    
    @Query("SELECT p FROM Project p WHERE p.techStack LIKE %:tech% ORDER BY p.stars DESC")
    List<Project> findByTechStackContaining(@Param("tech") String tech);
    
    @Query("SELECT p FROM Project p ORDER BY p.stars DESC, p.forks DESC")
    List<Project> findTopProjects();
    
    @Query("SELECT DISTINCT p.language FROM Project p WHERE p.language IS NOT NULL")
    List<String> findDistinctLanguages();
    
    @Query("SELECT DISTINCT p.techStack FROM Project p WHERE p.techStack IS NOT NULL")
    List<String> findDistinctTechStacks();
}
