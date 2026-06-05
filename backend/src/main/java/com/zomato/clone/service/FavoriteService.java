package com.zomato.clone.service;

import com.zomato.clone.dto.RestaurantDto;
import com.zomato.clone.entity.Favorite;
import com.zomato.clone.entity.Restaurant;
import com.zomato.clone.entity.User;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.FavoriteRepository;
import com.zomato.clone.repository.RestaurantRepository;
import com.zomato.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Transactional
    public boolean toggleFavorite(String email, Long restaurantId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Optional<Favorite> favoriteOpt = favoriteRepository.findByUserIdAndRestaurantId(user.getId(), restaurantId);

        if (favoriteOpt.isPresent()) {
            favoriteRepository.delete(favoriteOpt.get());
            return false; // Removed from favorites
        } else {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .restaurant(restaurant)
                    .build();
            favoriteRepository.save(favorite);
            return true; // Added to favorites
        }
    }

    @Transactional(readOnly = true)
    public List<RestaurantDto> getFavorites(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return favoriteRepository.findByUserId(user.getId()).stream()
                .map(Favorite::getRestaurant)
                .map(restaurantService::mapToRestaurantDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(String email, Long restaurantId) {
        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user == null) return false;
        return favoriteRepository.existsByUserIdAndRestaurantId(user.getId(), restaurantId);
    }
}
