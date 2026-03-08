package com.houserental.backend;

import com.houserental.backend.model.Property;
import com.houserental.backend.repository.PropertyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@SpringBootApplication
public class HouseRentalApplication {

    public static void main(String[] args) {
        SpringApplication.run(HouseRentalApplication.class, args);
    }

    @Bean
    CommandLineRunner seedProperties(PropertyRepository propertyRepository) {
        return args -> {
            migrateLegacyRecords(propertyRepository);

            Set<String> existingTitles = propertyRepository.findAll()
                    .stream()
                    .map(Property::getTitle)
                    .collect(Collectors.toSet());

            List<Property> defaults = List.of(
                    createProperty("Modern 2BHK in Indiranagar", "Walkable location with cafes, metro access and co-working spaces.", "Bengaluru", "12th Main Road, Indiranagar", "42000", 2, 2, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", "Apartment", true, "UrbanStays", List.of("Lift", "Power Backup", "Gated Security")),
                    createProperty("Family Villa with Garden", "Large independent villa with private parking and backyard.", "Pune", "Baner Main Road", "68000", 4, 3, "https://images.unsplash.com/photo-1568605114967-8130f3a36994", "Villa", false, "PrimeNest", List.of("Parking", "Pet Friendly", "Garden")),
                    createProperty("Compact Studio for Professionals", "Minimal and well-lit studio for working professionals.", "Hyderabad", "Gachibowli Financial District", "24000", 1, 1, "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85", "Studio", true, "MetroHomes", List.of("Wi-Fi Ready", "24x7 Water", "Gym")),
                    createProperty("Sea View 3BHK", "Premium sea-facing apartment with balcony and natural light.", "Mumbai", "Worli Sea Face", "120000", 3, 3, "https://images.unsplash.com/photo-1494526585095-c41746248156", "Apartment", true, "Skyline Realty", List.of("Sea View", "Clubhouse", "Pool")),
                    createProperty("Student Friendly Shared Flat", "Affordable 3BHK near college and public transport.", "Delhi", "North Campus", "18000", 1, 1, "https://images.unsplash.com/photo-1484154218962-a197022b5858", "Shared Flat", true, "CampusLiving", List.of("Furnished", "Wi-Fi", "Laundry")),
                    createProperty("Premium Duplex", "Two-level duplex with dedicated workspace and terrace.", "Chennai", "OMR, Thoraipakkam", "75000", 4, 4, "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd", "Duplex", true, "SouthKey Estates", List.of("Terrace", "Study Room", "Covered Parking")),
                    createProperty("Riverside Apartment", "Calm neighborhood with scenic views and good ventilation.", "Ahmedabad", "Sabarmati Riverfront", "36000", 2, 2, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", "Apartment", false, "BlueBrick", List.of("Lift", "Security", "Children Play Area")),
                    createProperty("Smart 1BHK", "Freshly renovated 1BHK with modular kitchen.", "Kolkata", "Salt Lake Sector 5", "27000", 1, 1, "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6", "Apartment", true, "HomeGrid", List.of("Modular Kitchen", "CCTV", "Power Backup")),
                    createProperty("Lake View 2BHK", "Quiet residential apartment near schools and hospitals.", "Jaipur", "Mansarovar Extension", "32000", 2, 2, "https://images.unsplash.com/photo-1507089947368-19c1da9775ae", "Apartment", false, "PinkCity Homes", List.of("Lift", "Parking", "Solar Water Heater")),
                    createProperty("Tech Park Studio", "Modern studio apartment for IT professionals.", "Noida", "Sector 62", "23000", 1, 1, "https://images.unsplash.com/photo-1493809842364-78817add7ffb", "Studio", true, "MetroLease", List.of("Wi-Fi", "Security", "Gym")),
                    createProperty("Comfort 3BHK", "Family-ready 3BHK with modular interiors.", "Surat", "Vesu Main Road", "41000", 3, 2, "https://images.unsplash.com/photo-1449844908441-8829872d2607", "Apartment", true, "Tapti Realty", List.of("Clubhouse", "Lift", "Visitor Parking"))
            );

            List<Property> missing = defaults.stream()
                    .filter(property -> !existingTitles.contains(property.getTitle()))
                    .toList();

            if (!missing.isEmpty()) {
                propertyRepository.saveAll(missing);
            }
        };
    }

    private void migrateLegacyRecords(PropertyRepository propertyRepository) {
        List<Property> properties = propertyRepository.findAll();
        boolean changed = false;

        for (Property property : properties) {
            switch (property.getCity()) {
                case "New York" -> {
                    property.setCity("Jaipur");
                    property.setTitle("Jaipur Heritage 2BHK");
                    property.setAddress("C-Scheme, Jaipur");
                    property.setListedBy("Rajasthan Dwellings");
                    changed = true;
                }
                case "Austin" -> {
                    property.setCity("Lucknow");
                    property.setTitle("Gomti Nagar Family Villa");
                    property.setAddress("Gomti Nagar Extension");
                    property.setListedBy("Awadh Estates");
                    changed = true;
                }
                case "San Francisco" -> {
                    property.setCity("Pune");
                    property.setTitle("Koregaon Park Smart Studio");
                    property.setAddress("Koregaon Park");
                    property.setListedBy("Pune Habitat");
                    changed = true;
                }
                default -> {
                }
            }
        }

        if (changed) {
            propertyRepository.saveAll(properties);
        }
    }

    private Property createProperty(String title,
                                    String description,
                                    String city,
                                    String address,
                                    String rent,
                                    int bedrooms,
                                    int bathrooms,
                                    String imageUrl,
                                    String propertyType,
                                    boolean furnished,
                                    String listedBy,
                                    List<String> amenities) {
        return Property.builder()
                .title(title)
                .description(description)
                .city(city)
                .address(address)
                .monthlyRent(new BigDecimal(rent))
                .bedrooms(bedrooms)
                .bathrooms(bathrooms)
                .imageUrl(imageUrl)
                .available(true)
                .propertyType(propertyType)
                .furnished(furnished)
                .listedBy(listedBy)
                .amenities(amenities)
                .createdAt(Instant.now())
                .build();
    }
}
