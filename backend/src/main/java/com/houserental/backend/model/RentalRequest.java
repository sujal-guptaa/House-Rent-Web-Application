package com.houserental.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Document(collection = "rental_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalRequest {

    @Id
    private String id;

    private String propertyId;
    private String tenantName;
    private String tenantEmail;
    private String tenantPhone;
    private LocalDate preferredMoveInDate;
    private String message;

    @Builder.Default
    private String status = "PENDING";

    private Instant createdAt;
}