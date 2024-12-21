package com.Infosys.Repository;

import com.Infosys.Entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {
    List<CourseProgress> findByEmployeeEmployeeId(Long employeeId);
    List<CourseProgress> findByEmployeeUsername(String username);
    List<CourseProgress> findByCourseCourseId(Long courseId);
    Optional<CourseProgress> findByEmployeeEmployeeIdAndCourseCourseId(Long employeeId, Long courseId);
}