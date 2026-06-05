package com.zomato.clone.controller;

import com.zomato.clone.dto.ApiResponse;
import com.zomato.clone.dto.RestaurantDto;
import com.zomato.clone.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RestaurantDto>>> getRestaurants(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer maxDeliveryTime,
            @RequestParam(required = false, defaultValue = "false") Boolean vegOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<RestaurantDto> restaurants = restaurantService.getRestaurants(
                city, search, cuisine, minRating, maxDeliveryTime, vegOnly, page, size, sortBy, sortDir);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Restaurants loaded successfully", restaurants));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantDto>> getRestaurantById(@PathVariable Long id) {
        RestaurantDto restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Restaurant details loaded", restaurant));
    }
}
