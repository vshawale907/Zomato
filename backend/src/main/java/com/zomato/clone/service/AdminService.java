package com.zomato.clone.service;

import com.zomato.clone.dto.AdminDashboardDto;
import com.zomato.clone.dto.RestaurantSalesDto;
import com.zomato.clone.dto.UserDto;
import com.zomato.clone.entity.Role;
import com.zomato.clone.entity.User;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.OrderRepository;
import com.zomato.clone.repository.RestaurantRepository;
import com.zomato.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthService authService;

    @Transactional(readOnly = true)
    public AdminDashboardDto getAdminDashboardStats() {
        Long totalUsers = userRepository.count();
        Long totalRestaurants = restaurantRepository.count();
        Long totalOrders = orderRepository.count();
        Double totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = 0.0;
        }

        // Top 5 restaurants
        List<Object[]> topResRaw = orderRepository.findTopRestaurants(PageRequest.of(0, 5));
        List<RestaurantSalesDto> topRestaurants = topResRaw.stream().map(row -> RestaurantSalesDto.builder()
                .restaurantId((Long) row[0])
                .restaurantName((String) row[1])
                .orderCount((Long) row[2])
                .build()).collect(Collectors.toList());

        return AdminDashboardDto.builder()
                .totalUsers(totalUsers)
                .totalRestaurants(totalRestaurants)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .topRestaurants(topRestaurants)
                .build();
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable).map(authService::mapToUserDto);
    }

    @Transactional
    public UserDto updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(role);
        User saved = userRepository.save(user);
        return authService.mapToUserDto(saved);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(userId);
    }
}
