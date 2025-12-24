package com.skillforge.service;

import com.skillforge.model.Exam;
import com.skillforge.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExamService {
    @Autowired
    private ExamRepository examRepository;
    
    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }
    
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }
    
    public Exam getExamById(Long id) {
        return examRepository.findById(id).orElseThrow();
    }
    
    public List<Exam> getExamsByCourse(Long courseId) {
        return examRepository.findByCourseId(courseId);
    }
    
    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }
}
