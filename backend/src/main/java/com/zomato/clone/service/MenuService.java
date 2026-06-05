package com.zomato.clone.service;

import com.zomato.clone.dto.MenuItemDto;
import com.zomato.clone.entity.MenuItem;
import com.zomato.clone.entity.Restaurant;
import com.zomato.clone.entity.User;
import com.zomato.clone.exception.BadRequestException;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.MenuItemRepository;
import com.zomato.clone.repository.RestaurantRepository;
import com.zomato.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<MenuItemDto> getMenuItems(Long restaurantId, String category, Boolean veg, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return menuItemRepository.findByRestaurantIdAndNameContainingIgnoreCase(restaurantId, search).stream()
                    .map(this::mapToMenuItemDto)
                    .collect(Collectors.toList());
        }
        if (category != null && !category.trim().isEmpty()) {
            return menuItemRepository.findByRestaurantIdAndCategory(restaurantId, category).stream()
                    .map(this::mapToMenuItemDto)
                    .collect(Collectors.toList());
        }
        if (veg != null) {
            return menuItemRepository.findByRestaurantIdAndVeg(restaurantId, veg).stream()
                    .map(this::mapToMenuItemDto)
                    .collect(Collectors.toList());
        }
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToMenuItemDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuItemDto getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        return mapToMenuItemDto(item);
    }

    @Transactional
    public MenuItemDto addMenuItem(Long restaurantId, MenuItemDto dto, String ownerEmail) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId()) && !owner.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Unauthorized access to restaurant menu management");
        }

        MenuItem menuItem = MenuItem.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .image(dto.getImage())
                .price(dto.getPrice())
                .category(dto.getCategory())
                .veg(dto.isVeg())
                .available(dto.isAvailable())
                .restaurant(restaurant)
                .build();

        MenuItem saved = menuItemRepository.save(menuItem);
        return mapToMenuItemDto(saved);
    }

    @Transactional
    public MenuItemDto updateMenuItem(Long itemId, MenuItemDto dto, String ownerEmail) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Restaurant restaurant = menuItem.getRestaurant();
        if (!restaurant.getOwner().getId().equals(owner.getId()) && !owner.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Unauthorized access to restaurant menu management");
        }

        menuItem.setName(dto.getName());
        menuItem.setDescription(dto.getDescription());
        if (dto.getImage() != null) menuItem.setImage(dto.getImage());
        menuItem.setPrice(dto.getPrice());
        menuItem.setCategory(dto.getCategory());
        menuItem.setVeg(dto.isVeg());
        menuItem.setAvailable(dto.isAvailable());

        MenuItem updated = menuItemRepository.save(menuItem);
        return mapToMenuItemDto(updated);
    }

    @Transactional
    public void deleteMenuItem(Long itemId, String ownerEmail) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Restaurant restaurant = menuItem.getRestaurant();
        if (!restaurant.getOwner().getId().equals(owner.getId()) && !owner.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Unauthorized access to restaurant menu management");
        }

        menuItemRepository.delete(menuItem);
    }

    public MenuItemDto mapToMenuItemDto(MenuItem item) {
        if (item == null) return null;
        return MenuItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .image(item.getImage())
                .price(item.getPrice())
                .category(item.getCategory())
                .veg(item.isVeg())
                .available(item.isAvailable())
                .restaurantId(item.getRestaurant().getId())
                .build();
    }
}
