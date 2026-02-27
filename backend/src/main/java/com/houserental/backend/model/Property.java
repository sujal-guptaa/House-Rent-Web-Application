package com.houserental.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    private String id;

    private String title;
    private String description;
    private String city;
    private String address;
    private BigDecimal monthlyRent;
    private int bedrooms;
    private int bathrooms;
    private String imageUrl;
    private boolean available;
    private String propertyType;
    private boolean furnished;
    private String listedBy;

    @Builder.Default
    private List<String> amenities = new ArrayList<>();

    private Instant createdAt;
}