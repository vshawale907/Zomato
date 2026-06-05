package com.zomato.clone.controller;

import com.zomato.clone.dto.ApiResponse;
import com.zomato.clone.dto.ReviewDto;
import com.zomato.clone.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getReviewsByRestaurantId(@PathVariable Long restaurantId) {
        List<ReviewDto> reviews = reviewService.getReviewsByRestaurantId(restaurantId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reviews loaded", reviews));
    }

    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<ReviewDto>> addReview(
            Principal principal,
            @PathVariable Long restaurantId,
            @Valid @RequestBody ReviewDto dto) {

        ReviewDto saved = reviewService.addReview(principal.getName(), restaurantId, dto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Review added successfully", saved), HttpStatus.CREATED);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewDto>> updateReview(
            Principal principal,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDto dto) {

        ReviewDto updated = reviewService.updateReview(principal.getName(), reviewId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Review updated successfully", updated));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<String>> deleteReview(Principal principal, @PathVariable Long reviewId) {
        reviewService.deleteReview(principal.getName(), reviewId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Review deleted successfully"));
    }
}
