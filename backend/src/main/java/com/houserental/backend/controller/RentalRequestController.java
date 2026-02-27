package com.houserental.backend.controller;

import com.houserental.backend.model.RentalRequest;
import com.houserental.backend.service.RentalRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rental-requests")
public class RentalRequestController {

    private final RentalRequestService rentalRequestService;

    public RentalRequestController(RentalRequestService rentalRequestService) {
        this.rentalRequestService = rentalRequestService;
    }

    @PostMapping
    public ResponseEntity<RentalRequest> create(@Valid @RequestBody RentalRequest rentalRequest) {
        return ResponseEntity.ok(rentalRequestService.create(rentalRequest));
    }

    @GetMapping
    public List<RentalRequest> getAll(@RequestParam(required = false) String status) {
        return rentalRequestService.getAll(status);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RentalRequest> updateStatus(@PathVariable String id, @RequestParam String status) {
        return rentalRequestService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/property/{propertyId}")
    public List<RentalRequest> getForProperty(@PathVariable String propertyId) {
        return rentalRequestService.getForProperty(propertyId);
    }
}
