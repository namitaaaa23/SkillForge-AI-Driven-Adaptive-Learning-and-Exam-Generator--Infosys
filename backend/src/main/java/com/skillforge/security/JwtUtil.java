package com.skillforge.security;

import org.springframework.stereotype.Component;
import java.util.Base64;

@Component
public class JwtUtil {
    private final String secret = "skillforge-secret-key";

    public String generateToken(String email) {
        try {
            // Simple token generation without JWT library
            String payload = email + ":" + System.currentTimeMillis();
            return Base64.getEncoder().encodeToString(payload.getBytes());
        } catch (Exception e) {
            System.out.println("Token generation error: " + e.getMessage());
            return "simple-token-" + email.hashCode();
        }
    }

    public String extractEmail(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            return decoded.split(":")[0];
        } catch (Exception e) {
            return "unknown@example.com";
        }
    }

    public boolean isTokenValid(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            return decoded.contains(":");
        } catch (Exception e) {
            return false;
        }
    }
}