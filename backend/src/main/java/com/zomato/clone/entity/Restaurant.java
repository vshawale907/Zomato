package com.zomato.clone.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    private String image;
    private String coverImage;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String city;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private String cuisineType; // Comma separated values e.g. "North Indian, Fast Food, Desserts"

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer numRatings = 0;

    @Column(nullable = false)
    private Integer deliveryTime; // In minutes

    @Column(nullable = false)
    private Double minimumOrder;

    @Column(nullable = false)
    private String openingTime; // e.g. "09:00 AM"

    @Column(nullable = false)
    private String closingTime; // e.g. "11:00 PM"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MenuItem> menuItems = new ArrayList<>();
}
