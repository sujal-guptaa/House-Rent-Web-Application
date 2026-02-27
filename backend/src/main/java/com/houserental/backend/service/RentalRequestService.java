package com.houserental.backend.service;

import com.houserental.backend.model.RentalRequest;
import com.houserental.backend.repository.RentalRequestRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

@Service
public class RentalRequestService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("PENDING", "APPROVED", "REJECTED");

    private final RentalRequestRepository rentalRequestRepository;
    private final AdminChangeLogService adminChangeLogService;

    public RentalRequestService(RentalRequestRepository rentalRequestRepository,
                                AdminChangeLogService adminChangeLogService) {
        this.rentalRequestRepository = rentalRequestRepository;
        this.adminChangeLogService = adminChangeLogService;
    }

    public RentalRequest create(RentalRequest request) {
        request.setCreatedAt(Instant.now());
        request.setStatus("PENDING");
        return rentalRequestRepository.save(request);
    }

    public List<RentalRequest> getForProperty(String propertyId) {
        return rentalRequestRepository.findByPropertyId(propertyId);
    }

    public List<RentalRequest> getAll(String status) {
        if (status == null || status.isBlank()) {
            return rentalRequestRepository.findAllByOrderByCreatedAtDesc();
        }
        String normalized = status.toUpperCase(Locale.ROOT);
        validateStatus(normalized);
        return rentalRequestRepository.findByStatusOrderByCreatedAtDesc(normalized);
    }

    public Optional<RentalRequest> updateStatus(String id, String status) {
        String normalized = status.toUpperCase(Locale.ROOT);
        validateStatus(normalized);

        return rentalRequestRepository.findById(id)
                .map(existing -> {
                    RentalRequest previousState = RentalRequest.builder()
                            .id(existing.getId())
                            .propertyId(existing.getPropertyId())
                            .tenantName(existing.getTenantName())
                            .tenantEmail(existing.getTenantEmail())
                            .tenantPhone(existing.getTenantPhone())
                            .preferredMoveInDate(existing.getPreferredMoveInDate() == null ? null : LocalDate.from(existing.getPreferredMoveInDate()))
                            .message(existing.getMessage())
                            .status(existing.getStatus())
                            .createdAt(existing.getCreatedAt())
                            .build();

                    existing.setStatus(normalized);
                    RentalRequest updated = rentalRequestRepository.save(existing);

                    adminChangeLogService.logRentalRequestChange(
                            "RENTAL_REQUEST_STATUS_UPDATE",
                            id,
                            previousState,
                            updated
                    );

                    return updated;
                });
    }

    private void validateStatus(String status) {
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid status. Allowed values: PENDING, APPROVED, REJECTED");
        }
    }
}
