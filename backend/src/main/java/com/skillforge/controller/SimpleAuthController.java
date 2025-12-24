package com.skillforge.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/simple")
@CrossOrigin(origins = "*")
public class SimpleAuthController {

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", "simple-jwt-token-12345");
        response.put("message", "Registration successful");
        response.put("user", Map.of(
            "id", 1,
            "name", request.get("name"),
            "email", request.get("email"),
            "role", "STUDENT"
        ));
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", "simple-jwt-token-67890");
        response.put("message", "Login successful");
        response.put("user", Map.of(
            "id", 1,
            "name", "Test User",
            "email", request.get("email"),
            "role", "STUDENT"
        ));
        return response;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dashboard loaded");
        response.put("user", Map.of(
            "id", 1,
            "name", "Test User",
            "email", "test@example.com",
            "role", "STUDENT"
        ));
        response.put("totalCourses", 5);
        response.put("totalUsers", 10);
        return response;
    }
}