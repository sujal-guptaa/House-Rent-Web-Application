package com.houserental.backend.repository;

import com.houserental.backend.model.RentalRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RentalRequestRepository extends MongoRepository<RentalRequest, String> {
    List<RentalRequest> findByPropertyId(String propertyId);
    List<RentalRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<RentalRequest> findAllByOrderByCreatedAtDesc();
}
