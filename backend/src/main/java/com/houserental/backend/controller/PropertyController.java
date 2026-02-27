package com.houserental.backend.controller;

import com.houserental.backend.model.Property;
import com.houserental.backend.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public List<Property> getAll(@RequestParam(required = false) String city,
                                 @RequestParam(required = false) BigDecimal minRent,
                                 @RequestParam(required = false) BigDecimal maxRent,
                                 @RequestParam(required = false) Integer minBedrooms,
                                 @RequestParam(required = false) Boolean availableOnly,
                                 @RequestParam(required = false) String sortBy) {
        return propertyService.getAll(city, minRent, maxRent, minBedrooms, availableOnly, sortBy);
    }

    @GetMapping("/cities")
    public Set<String> getCities() {
        return propertyService.getCities();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getById(@PathVariable String id) {
        return propertyService.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Property> create(@Valid @RequestBody Property property) {
        return ResponseEntity.ok(propertyService.create(property));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<Property> updateAvailability(@PathVariable String id, @RequestParam boolean available) {
        return propertyService.updateAvailability(id, available)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!propertyService.deleteById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
