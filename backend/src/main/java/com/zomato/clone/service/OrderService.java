package com.zomato.clone.service;

import com.zomato.clone.dto.OrderDto;
import com.zomato.clone.dto.OrderItemDto;
import com.zomato.clone.entity.*;
import com.zomato.clone.exception.BadRequestException;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    public OrderDto placeOrder(String email, Long addressId, String paymentMethod) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Selected address is invalid for this user");
        }

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        Restaurant restaurant = cartItems.get(0).getMenuItem().getRestaurant();
        Double totalAmount = cartItems.stream().mapToDouble(CartItem::getSubtotal).sum();

        // Build Order
        String addressString = address.getStreet() + ", " + address.getCity() + ", " + address.getState() + " - " + address.getZipCode();

        Order order = Order.builder()
                .user(user)
                .restaurant(restaurant)
                .totalAmount(totalAmount)
                .status(OrderStatus.PLACED)
                .deliveryAddress(addressString)
                .paymentMethod(paymentMethod)
                .paymentStatus(paymentMethod.equalsIgnoreCase("CASH_ON_DELIVERY") ? "PENDING" : "PAID") // Mock checkout approval
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(cartItem.getMenuItem())
                    .itemName(cartItem.getMenuItem().getName())
                    .itemPrice(cartItem.getMenuItem().getPrice())
                    .quantity(cartItem.getQuantity())
                    .subtotal(cartItem.getSubtotal())
                    .build();
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear user cart
        cartItemRepository.deleteByUserId(user.getId());

        return mapToOrderDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Allow buyer, restaurant owner, or admin to view order
        boolean isBuyer = order.getUser().getId().equals(user.getId());
        boolean isOwner = order.getRestaurant().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isBuyer && !isOwner && !isAdmin) {
            throw new BadRequestException("You are not authorized to view this order");
        }

        return mapToOrderDto(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> getCustomerOrderHistory(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable).map(this::mapToOrderDto);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Only restaurant owner or admin can update status
        boolean isOwner = order.getRestaurant().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You are not authorized to update this order's status");
        }

        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) {
            order.setPaymentStatus("PAID"); // Mark as paid if cash on delivery is delivered
        }

        Order updated = orderRepository.save(order);
        return mapToOrderDto(updated);
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        boolean isBuyer = order.getUser().getId().equals(user.getId());
        boolean isOwner = order.getRestaurant().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isBuyer && !isOwner && !isAdmin) {
            throw new BadRequestException("You are not authorized to cancel this order");
        }

        // Buyer can cancel only if PLACED
        if (isBuyer && order.getStatus() != OrderStatus.PLACED) {
            throw new BadRequestException("Order cannot be cancelled. It is already " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);
        return mapToOrderDto(updated);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> getOwnerOrders(String ownerEmail, int page, int size) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByRestaurantOwnerIdOrderByCreatedAtDesc(owner.getId(), pageable).map(this::mapToOrderDto);
    }

    public OrderDto mapToOrderDto(Order order) {
        if (order == null) return null;
        List<OrderItemDto> items = order.getOrderItems().stream().map(item -> OrderItemDto.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem() != null ? item.getMenuItem().getId() : null)
                .itemName(item.getItemName())
                .itemPrice(item.getItemPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build()).collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getFullName())
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .restaurantImage(order.getRestaurant().getImage())
                .orderItems(items)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
