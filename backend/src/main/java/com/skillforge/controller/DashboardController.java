package com.skillforge.controller;

import com.skillforge.dto.ApiResponse;
import com.skillforge.model.User;
import com.skillforge.service.UserService;
import com.skillforge.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    private final UserService userService;
    private final CourseService courseService;

    public DashboardController(UserService userService, CourseService courseService) {
        this.userService = userService;
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard() {
        try {
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("success", true);
            dashboard.put("message", "Dashboard loaded successfully");
            
            // User data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", 1);
            userData.put("name", "Current User");
            userData.put("email", "user@example.com");
            userData.put("role", "STUDENT");
            dashboard.put("user", userData);
            
            // Dashboard stats
            dashboard.put("totalCourses", 5);
            dashboard.put("totalUsers", 10);
            dashboard.put("totalExams", 8);
            dashboard.put("completedCourses", 3);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Dashboard failed");
            return ResponseEntity.badRequest().body(error);
        }
    }
}