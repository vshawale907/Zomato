package com.zomato.clone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantDto {
    private Long id;

    @NotBlank(message = "Restaurant name is required")
    private String name;

    private String description;
    private String image;
    private String coverImage;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private Double latitude;
    private Double longitude;

    @NotBlank(message = "Cuisine type is required")
    private String cuisineType;

    private Double rating;
    private Integer numRatings;

    @NotNull(message = "Delivery time is required")
    @Positive(message = "Delivery time must be positive")
    private Integer deliveryTime;

    @NotNull(message = "Minimum order amount is required")
    @Positive(message = "Minimum order must be positive")
    private Double minimumOrder;

    @NotBlank(message = "Opening time is required")
    private String openingTime;

    @NotBlank(message = "Closing time is required")
    private String closingTime;

    private Long ownerId;
    private List<MenuItemDto> menuItems;
}
