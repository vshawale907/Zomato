package com.zomato.clone.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private Long id;
    private Long menuItemId;
    private String itemName;
    private Double itemPrice;
    private Integer quantity;
    private Double subtotal;
}
