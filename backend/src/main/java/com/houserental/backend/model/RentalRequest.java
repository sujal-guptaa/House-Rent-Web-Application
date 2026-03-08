package com.houserental.backend.model;

import lombok.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank(message = "Property id is required")
    private String propertyId;
    @NotBlank(message = "Tenant name is required")
    private String tenantName;
    @NotBlank(message = "Tenant email is required")
    @Email(message = "Please provide a valid email address")
    private String tenantEmail;
    @NotBlank(message = "Tenant phone is required")
    @Pattern(regexp = "^(?:\\+91[- ]?)?[6-9]\\d{9}$", message = "Please provide a valid Indian phone number")
    private String tenantPhone;
    private LocalDate preferredMoveInDate;
    @NotBlank(message = "Message is required")
    private String message;

    @Builder.Default
    private String status = "PENDING";

    private Instant createdAt;
}
