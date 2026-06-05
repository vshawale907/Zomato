package com.zomato.clone.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDto {
    private Long totalUsers;
    private Long totalRestaurants;
    private Long totalOrders;
    private Double totalRevenue;
    private List<RestaurantSalesDto> topRestaurants;
}
