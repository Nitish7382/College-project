package com.Infosys.Repository;

import com.Infosys.Entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Long> {
//    List<AssessmentQuestion> findByAssessmentAssessmentId(Long assessmentId);
}
