package com.zomato.clone.controller;

import com.zomato.clone.dto.ApiResponse;
import com.zomato.clone.dto.RestaurantDto;
import com.zomato.clone.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/toggle/{restaurantId}")
    public ResponseEntity<ApiResponse<Boolean>> toggleFavorite(Principal principal, @PathVariable Long restaurantId) {
        boolean isFavorited = favoriteService.toggleFavorite(principal.getName(), restaurantId);
        String message = isFavorited ? "Added to favorites" : "Removed from favorites";
        return ResponseEntity.ok(new ApiResponse<>(true, message, isFavorited));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantDto>>> getFavorites(Principal principal) {
        List<RestaurantDto> favorites = favoriteService.getFavorites(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Favorites loaded successfully", favorites));
    }

    @GetMapping("/check/{restaurantId}")
    public ResponseEntity<ApiResponse<Boolean>> checkFavorite(Principal principal, @PathVariable Long restaurantId) {
        boolean isFav = favoriteService.isFavorite(principal.getName(), restaurantId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wishlist status retrieved", isFav));
    }
}
