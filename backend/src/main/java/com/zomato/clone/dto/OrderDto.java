package com.zomato.clone.dto;

import com.zomato.clone.entity.OrderStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantImage;
    private List<OrderItemDto> orderItems;
    private Double totalAmount;
    private OrderStatus status;
    private String deliveryAddress;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;
}
