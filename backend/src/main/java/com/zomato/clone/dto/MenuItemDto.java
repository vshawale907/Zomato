package com.zomato.clone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemDto {
    private Long id;

    @NotBlank(message = "Item name is required")
    private String name;

    private String description;
    private String image;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category; // Starters, Main Course, Desserts, Beverages

    @Builder.Default
    private boolean veg = true;

    @Builder.Default
    private boolean available = true;

    private Long restaurantId;
}
