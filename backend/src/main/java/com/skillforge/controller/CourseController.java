package com.skillforge.controller;

import com.skillforge.dto.ApiResponse;
import com.skillforge.model.Course;
import com.skillforge.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {
    @Autowired
    private CourseService courseService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody Course course, Authentication auth) {
        Course created = courseService.createCourse(course);
        return ResponseEntity.ok(ApiResponse.success(created));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCourses()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> ResponseEntity.ok(ApiResponse.success(course)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully"));
    }
}
