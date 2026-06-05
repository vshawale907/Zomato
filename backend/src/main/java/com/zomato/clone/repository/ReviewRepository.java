package com.zomato.clone.repository;

import com.zomato.clone.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.restaurant.id = :restaurantId")
    Double getAverageRatingForRestaurant(@Param("restaurantId") Long restaurantId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.restaurant.id = :restaurantId")
    Integer getReviewCountForRestaurant(@Param("restaurantId") Long restaurantId);
}
