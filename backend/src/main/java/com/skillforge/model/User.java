package com.skillforge.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.STUDENT;
    
    // Default constructor
    public User() {}
    
    // Constructor with role defaulting
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = Role.STUDENT;
    }
    
    public enum Role {
        STUDENT, ADMIN, GUARDIAN
    }
}
