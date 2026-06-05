package com.zomato.clone.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {
    private List<CartItemDto> items;
    private Double totalAmount;
    private Long restaurantId;
    private String restaurantName;
}
