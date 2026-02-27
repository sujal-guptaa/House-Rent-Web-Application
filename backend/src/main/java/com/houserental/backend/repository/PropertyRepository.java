package com.houserental.backend.repository;

import com.houserental.backend.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PropertyRepository extends MongoRepository<Property, String> {
    List<Property> findByCityContainingIgnoreCase(String city);
}
