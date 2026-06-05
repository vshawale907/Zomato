package com.zomato.clone.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantSalesDto {
    private Long restaurantId;
    private String restaurantName;
    private Long orderCount;
}
