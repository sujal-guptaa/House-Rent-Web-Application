package com.houserental.backend.service;

import com.houserental.backend.model.Property;
import com.houserental.backend.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final AdminChangeLogService adminChangeLogService;

    public PropertyService(PropertyRepository propertyRepository, AdminChangeLogService adminChangeLogService) {
        this.propertyRepository = propertyRepository;
        this.adminChangeLogService = adminChangeLogService;
    }

    public List<Property> getAll(String city, BigDecimal minRent, BigDecimal maxRent, Integer minBedrooms, Boolean availableOnly, String sortBy) {
        Comparator<Property> comparator = switch (sortBy == null ? "latest" : sortBy.toLowerCase(Locale.ROOT)) {
            case "rent_asc" -> Comparator.comparing(Property::getMonthlyRent);
            case "rent_desc" -> Comparator.comparing(Property::getMonthlyRent).reversed();
            case "bedrooms_desc" -> Comparator.comparing(Property::getBedrooms).reversed();
            default -> Comparator.comparing(Property::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed();
        };

        return propertyRepository.findAll()
                .stream()
                .filter(p -> city == null || city.isBlank() || p.getCity().toLowerCase(Locale.ROOT).contains(city.toLowerCase(Locale.ROOT)))
                .filter(p -> minRent == null || p.getMonthlyRent().compareTo(minRent) >= 0)
                .filter(p -> maxRent == null || p.getMonthlyRent().compareTo(maxRent) <= 0)
                .filter(p -> minBedrooms == null || p.getBedrooms() >= minBedrooms)
                .filter(p -> availableOnly == null || !availableOnly || p.isAvailable())
                .sorted(comparator)
                .toList();
    }

    public Optional<Property> getById(String id) {
        return propertyRepository.findById(id);
    }

    public Property create(Property property) {
        if (property.getAmenities() == null) {
            property.setAmenities(List.of());
        }
        property.setCreatedAt(Instant.now());
        return propertyRepository.save(property);
    }

    public Optional<Property> updateAvailability(String id, boolean available) {
        return propertyRepository.findById(id)
                .map(existing -> {
                    Property previousState = Property.builder()
                            .id(existing.getId())
                            .title(existing.getTitle())
                            .description(existing.getDescription())
                            .city(existing.getCity())
                            .address(existing.getAddress())
                            .monthlyRent(existing.getMonthlyRent())
                            .bedrooms(existing.getBedrooms())
                            .bathrooms(existing.getBathrooms())
                            .imageUrl(existing.getImageUrl())
                            .available(existing.isAvailable())
                            .propertyType(existing.getPropertyType())
                            .furnished(existing.isFurnished())
                            .listedBy(existing.getListedBy())
                            .amenities(existing.getAmenities())
                            .createdAt(existing.getCreatedAt())
                            .build();

                    existing.setAvailable(available);
                    Property updated = propertyRepository.save(existing);

                    adminChangeLogService.logPropertyChange(
                            "PROPERTY_AVAILABILITY_UPDATE",
                            id,
                            previousState,
                            updated
                    );

                    return updated;
                });
    }

    public boolean deleteById(String id) {
        return propertyRepository.findById(id)
                .map(existing -> {
                    propertyRepository.deleteById(id);
                    adminChangeLogService.logPropertyChange(
                            "PROPERTY_DELETE",
                            id,
                            existing,
                            null
                    );
                    return true;
                })
                .orElse(false);
    }

    public Set<String> getCities() {
        return propertyRepository.findAll()
                .stream()
                .map(Property::getCity)
                .collect(TreeSet::new, TreeSet::add, TreeSet::addAll);
    }
}
