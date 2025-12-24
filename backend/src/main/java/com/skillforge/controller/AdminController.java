package com.skillforge.controller;

import com.skillforge.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final UserRepository userRepository;
    
    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @DeleteMapping("/users/all")
    public Map<String, Object> deleteAllUsers() {
        userRepository.deleteAll();
        return Map.of(
            "success", true,
            "message", "All users deleted successfully"
        );
    }
    
    @GetMapping("/users/count")
    public Map<String, Object> getUserCount() {
        return Map.of(
            "success", true,
            "totalUsers", userRepository.count()
        );
    }
    
    @GetMapping("/users/all")
    public Map<String, Object> getAllUsers() {
        var users = userRepository.findAll().stream()
            .map(user -> Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().toString()
            ))
            .toList();
            
        return Map.of(
            "success", true,
            "users", users,
            "totalUsers", users.size()
        );
    }
}