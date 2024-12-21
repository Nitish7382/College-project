package com.Infosys.Service;

import com.Infosys.Entity.RequestStatus;
import com.Infosys.Entity.TrainingRequest;
import com.Infosys.Filter.JWTFilter;
import com.Infosys.Repository.TrainingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingRequestService {

    @Autowired
    private TrainingRepository trainingRepository;

    public void acceptRequest(Long requestId) {
        TrainingRequest trainingRequest = trainingRepository.findByRequestId(requestId);
        if (trainingRequest != null) {
            trainingRequest.setStatus(RequestStatus.ACCEPTED);
            trainingRepository.save(trainingRequest);
        }
    }

    public void rejectRequest(Long requestId) {
        TrainingRequest trainingRequest = trainingRepository.findByRequestId(requestId);
        if (trainingRequest != null) {
            trainingRequest.setStatus(RequestStatus.REJECTED);
            trainingRepository.save(trainingRequest);
        }
    }

    public List<TrainingRequest> getAllRequests() {
        return trainingRepository.findAll();
    }

    public TrainingRequest getRequestByRequestId(Long requestId) {
        return trainingRepository.findByRequestId(requestId);
    }

    public void updateRequest(Long requestId) {
        TrainingRequest trainingRequest = trainingRepository.findByRequestId(requestId);
        if(trainingRequest != null) {
            trainingRequest.setStatus(RequestStatus.COMPLETED);
            trainingRepository.save(trainingRequest);
        }
    }
}
