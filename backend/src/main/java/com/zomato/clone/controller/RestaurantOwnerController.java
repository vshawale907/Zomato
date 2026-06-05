package com.zomato.clone.controller;

import com.zomato.clone.dto.*;
import com.zomato.clone.entity.OrderStatus;
import com.zomato.clone.service.MenuService;
import com.zomato.clone.service.OrderService;
import com.zomato.clone.service.RestaurantOwnerService;
import com.zomato.clone.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/owner")
public class RestaurantOwnerController {

    @Autowired
    private RestaurantOwnerService ownerService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private MenuService menuService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<OwnerDashboardDto>> getOwnerDashboardStats(Principal principal) {
        OwnerDashboardDto stats = ownerService.getOwnerDashboardStats(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Owner stats loaded", stats));
    }

    @GetMapping("/restaurants")
    public ResponseEntity<ApiResponse<Page<RestaurantDto>>> getOwnerRestaurants(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<RestaurantDto> restaurants = restaurantService.getOwnerRestaurants(principal.getName(), page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Owner restaurants loaded", restaurants));
    }

    @PostMapping("/restaurants")
    public ResponseEntity<ApiResponse<RestaurantDto>> createRestaurant(
            Principal principal,
            @Valid @RequestBody RestaurantDto dto) {
        
        RestaurantDto saved = restaurantService.createRestaurant(dto, principal.getName());
        return new ResponseEntity<>(new ApiResponse<>(true, "Restaurant created successfully", saved), HttpStatus.CREATED);
    }

    @PutMapping("/restaurants/{id}")
    public ResponseEntity<ApiResponse<RestaurantDto>> updateRestaurant(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody RestaurantDto dto) {
        
        RestaurantDto updated = restaurantService.updateRestaurant(id, dto, principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Restaurant updated successfully", updated));
    }

    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRestaurant(Principal principal, @PathVariable Long id) {
        restaurantService.deleteRestaurant(id, principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Restaurant deleted successfully"));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getOwnerOrders(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<OrderDto> orders = orderService.getOwnerOrders(principal.getName(), page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Incoming orders loaded", orders));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            Principal principal,
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        
        OrderDto updated = orderService.updateOrderStatus(orderId, status, principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Order status updated successfully", updated));
    }

    @PostMapping("/restaurants/{restaurantId}/menu")
    public ResponseEntity<ApiResponse<MenuItemDto>> addMenuItem(
            Principal principal,
            @PathVariable Long restaurantId,
            @Valid @RequestBody MenuItemDto dto) {
        
        MenuItemDto saved = menuService.addMenuItem(restaurantId, dto, principal.getName());
        return new ResponseEntity<>(new ApiResponse<>(true, "Menu item added successfully", saved), HttpStatus.CREATED);
    }

    @PutMapping("/menu-items/{itemId}")
    public ResponseEntity<ApiResponse<MenuItemDto>> updateMenuItem(
            Principal principal,
            @PathVariable Long itemId,
            @Valid @RequestBody MenuItemDto dto) {
        
        MenuItemDto updated = menuService.updateMenuItem(itemId, dto, principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Menu item updated successfully", updated));
    }

    @DeleteMapping("/menu-items/{itemId}")
    public ResponseEntity<ApiResponse<String>> deleteMenuItem(Principal principal, @PathVariable Long itemId) {
        menuService.deleteMenuItem(itemId, principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Menu item deleted successfully"));
    }
}
