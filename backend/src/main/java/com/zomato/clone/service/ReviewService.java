package com.zomato.clone.service;

import com.zomato.clone.dto.ReviewDto;
import com.zomato.clone.entity.Restaurant;
import com.zomato.clone.entity.Review;
import com.zomato.clone.entity.User;
import com.zomato.clone.exception.BadRequestException;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.RestaurantRepository;
import com.zomato.clone.repository.ReviewRepository;
import com.zomato.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsByRestaurantId(Long restaurantId) {
        return reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId).stream()
                .map(this::mapToReviewDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto addReview(String email, Long restaurantId, ReviewDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Review review = Review.builder()
                .user(user)
                .restaurant(restaurant)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        Review saved = reviewRepository.save(review);
        recalculateRestaurantRating(restaurantId);

        return mapToReviewDto(saved);
    }

    @Transactional
    public ReviewDto updateReview(String email, Long reviewId, ReviewDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Unauthorized to update this review");
        }

        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        Review updated = reviewRepository.save(review);

        recalculateRestaurantRating(review.getRestaurant().getId());

        return mapToReviewDto(updated);
    }

    @Transactional
    public void deleteReview(String email, Long reviewId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Unauthorized to delete this review");
        }

        Long restaurantId = review.getRestaurant().getId();
        reviewRepository.delete(review);

        recalculateRestaurantRating(restaurantId);
    }

    private void recalculateRestaurantRating(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Double avgRating = reviewRepository.getAverageRatingForRestaurant(restaurantId);
        Integer reviewCount = reviewRepository.getReviewCountForRestaurant(restaurantId);

        // Keep 1 decimal place
        double roundedRating = Math.round(avgRating * 10.0) / 10.0;

        restaurant.setRating(roundedRating);
        restaurant.setNumRatings(reviewCount);
        restaurantRepository.save(restaurant);
    }

    public ReviewDto mapToReviewDto(Review review) {
        if (review == null) return null;
        return ReviewDto.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .userProfileImage(review.getUser().getProfileImage())
                .restaurantId(review.getRestaurant().getId())
                .restaurantName(review.getRestaurant().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
