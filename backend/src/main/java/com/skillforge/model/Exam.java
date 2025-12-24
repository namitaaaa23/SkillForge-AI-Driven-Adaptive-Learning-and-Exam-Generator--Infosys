package com.skillforge.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Data
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    private Integer duration;
    private Integer totalMarks;
    private LocalDateTime createdAt = LocalDateTime.now();
}
