package com.houserental.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.houserental.backend.model.AdminChangeLog;
import com.houserental.backend.model.Property;
import com.houserental.backend.model.RentalRequest;
import com.houserental.backend.repository.AdminChangeLogRepository;
import com.houserental.backend.repository.PropertyRepository;
import com.houserental.backend.repository.RentalRequestRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AdminChangeLogService {

    private final AdminChangeLogRepository changeLogRepository;
    private final PropertyRepository propertyRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final ObjectMapper objectMapper;

    public AdminChangeLogService(AdminChangeLogRepository changeLogRepository,
                                 PropertyRepository propertyRepository,
                                 RentalRequestRepository rentalRequestRepository,
                                 ObjectMapper objectMapper) {
        this.changeLogRepository = changeLogRepository;
        this.propertyRepository = propertyRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.objectMapper = objectMapper;
    }

    public void logPropertyChange(String action, String entityId, Property previousState, Property newState) {
        saveLog("PROPERTY", entityId, action, previousState, newState);
    }

    public void logRentalRequestChange(String action, String entityId, RentalRequest previousState, RentalRequest newState) {
        saveLog("RENTAL_REQUEST", entityId, action, previousState, newState);
    }

    public List<AdminChangeLog> getRecentChanges() {
        return changeLogRepository.findTop20ByOrderByCreatedAtDesc();
    }

    public AdminChangeLog rollback(String changeId) {
        AdminChangeLog change = changeLogRepository.findById(changeId)
                .orElseThrow(() -> new IllegalArgumentException("Change log not found"));

        if (change.isRolledBack()) {
            throw new IllegalArgumentException("Change has already been rolled back");
        }

        try {
            switch (change.getAction()) {
                case "PROPERTY_AVAILABILITY_UPDATE", "PROPERTY_DELETE" -> {
                    Property previous = objectMapper.readValue(change.getPreviousState(), Property.class);
                    propertyRepository.save(previous);
                }
                case "RENTAL_REQUEST_STATUS_UPDATE" -> {
                    RentalRequest previous = objectMapper.readValue(change.getPreviousState(), RentalRequest.class);
                    rentalRequestRepository.save(previous);
                }
                default -> throw new IllegalArgumentException("Rollback is not supported for action: " + change.getAction());
            }
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Could not deserialize stored change log", ex);
        }

        change.setRolledBack(true);
        change.setRolledBackAt(Instant.now());
        return changeLogRepository.save(change);
    }

    private void saveLog(String entityType, String entityId, String action, Object previousState, Object newState) {
        try {
            AdminChangeLog changeLog = AdminChangeLog.builder()
                    .entityType(entityType)
                    .entityId(entityId)
                    .action(action)
                    .previousState(previousState == null ? null : objectMapper.writeValueAsString(previousState))
                    .newState(newState == null ? null : objectMapper.writeValueAsString(newState))
                    .createdAt(Instant.now())
                    .rolledBack(false)
                    .build();
            changeLogRepository.save(changeLog);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Could not serialize change log", ex);
        }
    }
}
