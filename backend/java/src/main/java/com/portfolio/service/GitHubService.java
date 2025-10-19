package com.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GitHubService {
    
    @Value("${portfolio.github.username}")
    private String githubUsername;
    
    @Value("${portfolio.github.api-url}")
    private String githubApiUrl;
    
    private final WebClient webClient;
    
    public GitHubService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.github.com")
                .build();
    }
    
    @Cacheable("github-user")
    public Map<String, Object> getUserInfo() {
        return webClient.get()
                .uri("/users/{username}", githubUsername)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
    
    @Cacheable("github-repos")
    public List<Map<String, Object>> getUserRepositories() {
        return webClient.get()
                .uri("/users/{username}/repos?sort=updated&per_page=100", githubUsername)
                .retrieve()
                .bodyToMono(List.class)
                .block();
    }
    
    @Cacheable("github-commits")
    public List<Map<String, Object>> getUserEvents() {
        return webClient.get()
                .uri("/users/{username}/events?per_page=50", githubUsername)
                .retrieve()
                .bodyToMono(List.class)
                .block();
    }
    
    @Cacheable("github-stats")
    public Map<String, Object> getGitHubStats() {
        Map<String, Object> userInfo = getUserInfo();
        List<Map<String, Object>> repos = getUserRepositories();
        
        int totalStars = repos.stream()
                .mapToInt(repo -> (Integer) repo.getOrDefault("stargazers_count", 0))
                .sum();
        
        int totalForks = repos.stream()
                .mapToInt(repo -> (Integer) repo.getOrDefault("forks_count", 0))
                .sum();
        
        return Map.of(
            "username", githubUsername,
            "publicRepos", userInfo.get("public_repos"),
            "followers", userInfo.get("followers"),
            "following", userInfo.get("following"),
            "totalStars", totalStars,
            "totalForks", totalForks,
            "repositories", repos.size()
        );
    }
}
