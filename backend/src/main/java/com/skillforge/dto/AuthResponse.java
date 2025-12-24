package com.skillforge.dto;

import com.skillforge.model.User;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private User user;
    
    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new User();
        this.user.setId(user.getId());
        this.user.setName(user.getName());
        this.user.setEmail(user.getEmail());
        this.user.setRole(user.getRole());
        this.user.setPassword(null);
    }
}