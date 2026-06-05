package com.zomato.clone.repository;

import com.zomato.clone.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
    Page<Restaurant> findByCityIgnoreCase(String city, Pageable pageable);
    
    Page<Restaurant> findByOwnerId(Long ownerId, Pageable pageable);

    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN r.menuItems m WHERE " +
           "(:city IS NULL OR LOWER(r.city) = LOWER(:city)) AND " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.cuisineType) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:cuisine IS NULL OR LOWER(r.cuisineType) LIKE LOWER(CONCAT('%', :cuisine, '%'))) AND " +
           "(:minRating IS NULL OR r.rating >= :minRating) AND " +
           "(:maxDeliveryTime IS NULL OR r.deliveryTime <= :maxDeliveryTime) AND " +
           "(:vegOnly IS NULL OR :vegOnly = false OR m.veg = true)")
    Page<Restaurant> findFilteredRestaurants(
            @Param("city") String city,
            @Param("search") String search,
            @Param("cuisine") String cuisine,
            @Param("minRating") Double minRating,
            @Param("maxDeliveryTime") Integer maxDeliveryTime,
            @Param("vegOnly") Boolean vegOnly,
            Pageable pageable);
}
