package com.zomato.clone.service;

import com.zomato.clone.dto.MenuItemDto;
import com.zomato.clone.dto.RestaurantDto;
import com.zomato.clone.entity.Restaurant;
import com.zomato.clone.entity.User;
import com.zomato.clone.exception.BadRequestException;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.RestaurantRepository;
import com.zomato.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuService menuService;

    @Transactional(readOnly = true)
    public Page<RestaurantDto> getRestaurants(
            String city, String search, String cuisine, Double minRating,
            Integer maxDeliveryTime, Boolean vegOnly, int page, int size, String sortBy, String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Restaurant> restaurants = restaurantRepository.findFilteredRestaurants(
                city, search, cuisine, minRating, maxDeliveryTime, vegOnly, pageable);

        return restaurants.map(this::mapToRestaurantDto);
    }

    @Transactional(readOnly = true)
    public RestaurantDto getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        return mapToRestaurantDtoWithMenu(restaurant);
    }

    @Transactional
    public RestaurantDto createRestaurant(RestaurantDto dto, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner user not found"));

        Restaurant restaurant = Restaurant.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .image(dto.getImage())
                .coverImage(dto.getCoverImage())
                .address(dto.getAddress())
                .city(dto.getCity())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .cuisineType(dto.getCuisineType())
                .deliveryTime(dto.getDeliveryTime())
                .minimumOrder(dto.getMinimumOrder())
                .openingTime(dto.getOpeningTime())
                .closingTime(dto.getClosingTime())
                .owner(owner)
                .build();

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToRestaurantDto(saved);
    }

    @Transactional
    public RestaurantDto updateRestaurant(Long id, RestaurantDto dto, String ownerEmail) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner user not found"));

        // Check ownership
        if (!restaurant.getOwner().getId().equals(owner.getId()) && !owner.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You are not authorized to update this restaurant");
        }

        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        if (dto.getImage() != null) restaurant.setImage(dto.getImage());
        if (dto.getCoverImage() != null) restaurant.setCoverImage(dto.getCoverImage());
        restaurant.setAddress(dto.getAddress());
        restaurant.setCity(dto.getCity());
        restaurant.setLatitude(dto.getLatitude());
        restaurant.setLongitude(dto.getLongitude());
        restaurant.setCuisineType(dto.getCuisineType());
        restaurant.setDeliveryTime(dto.getDeliveryTime());
        restaurant.setMinimumOrder(dto.getMinimumOrder());
        restaurant.setOpeningTime(dto.getOpeningTime());
        restaurant.setClosingTime(dto.getClosingTime());

        Restaurant updated = restaurantRepository.save(restaurant);
        return mapToRestaurantDto(updated);
    }

    @Transactional
    public void deleteRestaurant(Long id, String ownerEmail) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner user not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId()) && !owner.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You are not authorized to delete this restaurant");
        }

        restaurantRepository.delete(restaurant);
    }

    @Transactional(readOnly = true)
    public Page<RestaurantDto> getOwnerRestaurants(String ownerEmail, int page, int size) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Pageable pageable = PageRequest.of(page, size);
        return restaurantRepository.findByOwnerId(owner.getId(), pageable).map(this::mapToRestaurantDto);
    }

    public RestaurantDto mapToRestaurantDto(Restaurant restaurant) {
        if (restaurant == null) return null;
        return RestaurantDto.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .image(restaurant.getImage())
                .coverImage(restaurant.getCoverImage())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .latitude(restaurant.getLatitude())
                .longitude(restaurant.getLongitude())
                .cuisineType(restaurant.getCuisineType())
                .rating(restaurant.getRating())
                .numRatings(restaurant.getNumRatings())
                .deliveryTime(restaurant.getDeliveryTime())
                .minimumOrder(restaurant.getMinimumOrder())
                .openingTime(restaurant.getOpeningTime())
                .closingTime(restaurant.getClosingTime())
                .ownerId(restaurant.getOwner().getId())
                .build();
    }

    public RestaurantDto mapToRestaurantDtoWithMenu(Restaurant restaurant) {
        RestaurantDto dto = mapToRestaurantDto(restaurant);
        if (restaurant.getMenuItems() != null) {
            dto.setMenuItems(restaurant.getMenuItems().stream()
                    .map(menuService::mapToMenuItemDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
