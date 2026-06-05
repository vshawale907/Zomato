package com.zomato.clone.service;

import com.zomato.clone.dto.OwnerDashboardDto;
import com.zomato.clone.entity.OrderStatus;
import com.zomato.clone.entity.User;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.OrderRepository;
import com.zomato.clone.repository.RestaurantRepository;
import com.zomato.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RestaurantOwnerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public OwnerDashboardDto getOwnerDashboardStats(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Long totalRestaurants = restaurantRepository.findByOwnerId(owner.getId(), PageRequest.of(0, 1)).getTotalElements();
        Long totalOrders = orderRepository.findByRestaurantOwnerIdOrderByCreatedAtDesc(owner.getId(), PageRequest.of(0, 1)).getTotalElements();
        
        Double totalRevenue = orderRepository.sumRevenueByOwnerId(owner.getId());
        if (totalRevenue == null) {
            totalRevenue = 0.0;
        }

        // Count active/pending orders (not delivered and not cancelled)
        long activeOrders = orderRepository.findByRestaurantOwnerIdOrderByCreatedAtDesc(owner.getId(), PageRequest.of(0, 10000))
                .getContent().stream()
                .filter(o -> o.getStatus() != OrderStatus.DELIVERED && o.getStatus() != OrderStatus.CANCELLED)
                .count();

        return OwnerDashboardDto.builder()
                .totalRestaurants(totalRestaurants)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .activeOrders(activeOrders)
                .build();
    }
}
