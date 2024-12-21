package com.Infosys.Service;

import com.Infosys.Entity.Course;
import com.Infosys.Entity.CourseAssignment;
import com.Infosys.Entity.CourseProgress;
import com.Infosys.Entity.DTO.CourseProgressDTO;
import com.Infosys.Entity.Employee;
import com.Infosys.Filter.JWTFilter;
import com.Infosys.Repository.CourseAssignmentRepository;
import com.Infosys.Repository.CourseProgressRepository;
import com.Infosys.Repository.CourseRepository;
import com.Infosys.Repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourseProgressService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CourseProgressRepository courseProgressRepository;

    @Autowired
    private CourseAssignmentRepository courseAssignmentRepository;

    private static final Logger logger = LoggerFactory.getLogger(CourseProgressService.class);


    public void updateCourseProgress(CourseProgressDTO courseProgressDTO) {
        Optional<CourseProgress> courseProgressOpt = courseProgressRepository.findByEmployeeEmployeeIdAndCourseCourseId(courseProgressDTO.getEmployeeId(), courseProgressDTO.getCourseId());

        if (courseProgressOpt.isPresent()) {
            CourseProgress courseProgress = courseProgressOpt.get();
            courseProgress.setProgressPercentage(courseProgressDTO.getProgressPercentage());
            courseProgress.setStatus(courseProgressDTO.getStatus());
            courseProgress.setLastAccessedDate(LocalDateTime.now());
            courseProgressRepository.save(courseProgress);
        } else {
            CourseProgress courseProgress = new CourseProgress();

            Optional<Course> courseOpt = courseRepository.findByCourseId(courseProgressDTO.getCourseId());
            courseOpt.ifPresent(courseProgress::setCourse);

            Optional<Employee> employeeOpt = employeeRepository.findByEmployeeId(courseProgressDTO.getEmployeeId());
            employeeOpt.ifPresent(courseProgress::setEmployee);

            courseProgress.setProgressPercentage(courseProgressDTO.getProgressPercentage());
            courseProgress.setStatus(courseProgressDTO.getStatus());
            courseProgress.setLastAccessedDate(LocalDateTime.now());
            courseProgressRepository.save(courseProgress);
        }
    }

    public List<CourseProgress> getCourseProgress(String username) {
        List<CourseProgress> courseProgressList = courseProgressRepository.findByEmployeeUsername(username);
        logger.info("Course progress retrieved: {}", courseProgressList);
        return courseProgressList;
    }

    public List<CourseProgress> getAllCourseProgress() {
        return courseProgressRepository.findAll();
    }
}
