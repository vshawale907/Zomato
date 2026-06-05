package com.zomato.clone.controller;

import com.zomato.clone.dto.ApiResponse;
import com.zomato.clone.dto.OrderDto;
import com.zomato.clone.dto.PlaceOrderRequest;
import com.zomato.clone.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> placeOrder(Principal principal, @Valid @RequestBody PlaceOrderRequest request) {
        OrderDto order = orderService.placeOrder(principal.getName(), request.getAddressId(), request.getPaymentMethod());
        return new ResponseEntity<>(new ApiResponse<>(true, "Order placed successfully", order), HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(Principal principal, @PathVariable Long orderId) {
        OrderDto order = orderService.getOrderById(orderId, principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Order details loaded", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getCustomerOrderHistory(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<OrderDto> history = orderService.getCustomerOrderHistory(principal.getName(), page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order history loaded", history));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(Principal principal, @PathVariable Long orderId) {
        OrderDto order = orderService.cancelOrder(orderId, principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Order cancelled successfully", order));
    }
}
