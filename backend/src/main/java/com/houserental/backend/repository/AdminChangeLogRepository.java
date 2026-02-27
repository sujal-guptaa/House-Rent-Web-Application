package com.houserental.backend.repository;

import com.houserental.backend.model.AdminChangeLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AdminChangeLogRepository extends MongoRepository<AdminChangeLog, String> {
    List<AdminChangeLog> findTop20ByOrderByCreatedAtDesc();
}
