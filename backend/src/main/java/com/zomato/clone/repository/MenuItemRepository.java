package com.zomato.clone.repository;

import com.zomato.clone.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantId(Long restaurantId);
    List<MenuItem> findByRestaurantIdAndCategory(Long restaurantId, String category);
    List<MenuItem> findByRestaurantIdAndVeg(Long restaurantId, boolean veg);
    List<MenuItem> findByRestaurantIdAndNameContainingIgnoreCase(Long restaurantId, String name);
}
