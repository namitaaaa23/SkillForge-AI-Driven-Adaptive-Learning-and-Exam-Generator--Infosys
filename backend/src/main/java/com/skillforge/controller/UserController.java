package com.skillforge.controller;

import com.skillforge.model.User;
import com.skillforge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newRole = request.get("role");
            User updatedUser = userService.updateUserRole(id, newRole);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Role updated successfully",
                "user", updatedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to update role"
            ));
        }
    }
}
