package com.Infosys.Repository;

import com.Infosys.Entity.EmployeeAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeAssessmentRepository extends JpaRepository<EmployeeAssessment, Long> {
    List<EmployeeAssessment> findByEmployeeEmployeeId(Long employeeId);
}
