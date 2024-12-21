package com.Infosys.Repository;

import com.Infosys.Entity.Assessment;
import com.Infosys.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    Optional<Assessment> findByCourseCourseId(Long courseId);

}
