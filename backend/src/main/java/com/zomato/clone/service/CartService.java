package com.zomato.clone.service;

import com.zomato.clone.dto.CartDto;
import com.zomato.clone.dto.CartItemDto;
import com.zomato.clone.entity.CartItem;
import com.zomato.clone.entity.MenuItem;
import com.zomato.clone.entity.User;
import com.zomato.clone.exception.BadRequestException;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.CartItemRepository;
import com.zomato.clone.repository.MenuItemRepository;
import com.zomato.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Transactional(readOnly = true)
    public CartDto getCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        return buildCartDto(items);
    }

    @Transactional
    public CartDto addItemToCart(String email, Long menuItemId, Integer quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));

        List<CartItem> currentItems = cartItemRepository.findByUserId(user.getId());

        // Validate single restaurant rule
        if (!currentItems.isEmpty()) {
            Long existingRestaurantId = currentItems.get(0).getMenuItem().getRestaurant().getId();
            if (!existingRestaurantId.equals(menuItem.getRestaurant().getId())) {
                throw new BadRequestException("CART_CONFLICT:Your cart contains items from another restaurant. Clear cart first?");
            }
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserIdAndMenuItemId(user.getId(), menuItemId);
        
        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .menuItem(menuItem)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(email);
    }

    @Transactional
    public CartDto updateItemQuantity(String email, Long cartItemId, Integer quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart(email);
    }

    @Transactional
    public CartDto removeItemFromCart(String email, Long cartItemId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(item);
        return getCart(email);
    }

    @Transactional
    public void clearCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        cartItemRepository.deleteByUserId(user.getId());
    }

    private CartDto buildCartDto(List<CartItem> items) {
        if (items.isEmpty()) {
            return CartDto.builder()
                    .items(List.of())
                    .totalAmount(0.0)
                    .restaurantId(null)
                    .restaurantName(null)
                    .build();
        }

        List<CartItemDto> itemDtos = items.stream().map(item -> CartItemDto.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem().getId())
                .menuItemName(item.getMenuItem().getName())
                .menuItemPrice(item.getMenuItem().getPrice())
                .menuItemImage(item.getMenuItem().getImage())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build()).collect(Collectors.toList());

        Double total = items.stream().mapToDouble(CartItem::getSubtotal).sum();
        MenuItem sampleItem = items.get(0).getMenuItem();

        return CartDto.builder()
                .items(itemDtos)
                .totalAmount(total)
                .restaurantId(sampleItem.getRestaurant().getId())
                .restaurantName(sampleItem.getRestaurant().getName())
                .build();
    }
}
