package com.Infosys.Service;

import com.Infosys.Entity.*;
import com.Infosys.Entity.DTO.AssessmentQuestionDTO;
import com.Infosys.Entity.DTO.EmployeeDTO;
import com.Infosys.Entity.DTO.TrainingRequestDTO;
import com.Infosys.Entity.DTO.UserDTO;
import com.Infosys.Repository.EmployeeRepository;
import com.Infosys.Repository.ManagerRepository;
import com.Infosys.Repository.TrainingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ManagerService {

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    public void addManager(UserDTO userDTO) {
        // Add manager logic
        Manager manager = new Manager();
        manager.setAccountId(userDTO.getAccountId());
        manager.setAccountName(userDTO.getAccountName());
        manager.setUsername(userDTO.getUsername());
        manager.setEmail(userDTO.getEmail());
        manager.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Hashing password
        managerRepository.save(manager);
    }

    public void requestForm(TrainingRequestDTO trainingRequestDTO) {
        // Get the username of the authenticated user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        TrainingRequest trainingRequest = new TrainingRequest();
        trainingRequest.setCourseName(trainingRequestDTO.getCourseName());
        trainingRequest.setDescription(trainingRequestDTO.getDescription());
        trainingRequest.setConcepts(trainingRequestDTO.getConcepts());
        trainingRequest.setDuration(trainingRequestDTO.getDuration());
        trainingRequest.setEmployeePosition(trainingRequestDTO.getEmployeePosition());

        // Convert DTO list of employee IDs or usernames to Employee entities
        List<Employee> employees = new ArrayList<>();
        for (EmployeeDTO employeeDTO : trainingRequestDTO.getRequiredEmployees()) {
            Employee employee = employeeRepository.findByUsername(employeeDTO.getUsername());
//                    .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeDTO.getEmployeeId()));
            employees.add(employee);
        }

        trainingRequest.setRequiredEmployees(employees);
        trainingRequest.setStatus(RequestStatus.PENDING);
        trainingRequest.setManagerUsername(username);
        trainingRepository.save(trainingRequest);
    }

    public List<TrainingRequest> getRequestByManagerName(String requestorname) {
        return trainingRepository.findByManagerUsername(requestorname);
    }

    public TrainingRequest getRequestByRequestId(Long requestId) {
        return trainingRepository.findByRequestId(requestId);
    }

}
