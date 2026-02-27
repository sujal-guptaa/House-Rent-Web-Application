package com.houserental.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "admin_change_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminChangeLog {

    @Id
    private String id;
    private String entityType;
    private String entityId;
    private String action;
    private String previousState;
    private String newState;
    private Instant createdAt;
    private boolean rolledBack;
    private Instant rolledBackAt;
}
