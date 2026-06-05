package com.zomato.clone.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerDashboardDto {
    private Long totalRestaurants;
    private Long totalOrders;
    private Double totalRevenue;
    private Long activeOrders;
}
