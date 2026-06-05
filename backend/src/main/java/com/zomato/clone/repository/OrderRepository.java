package com.zomato.clone.repository;

import com.zomato.clone.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    Page<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.restaurant.owner.id = :ownerId ORDER BY o.createdAt DESC")
    Page<Order> findByRestaurantOwnerIdOrderByCreatedAtDesc(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status = 'DELIVERED'")
    Double sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.restaurant.owner.id = :ownerId AND o.status = 'DELIVERED'")
    Double sumRevenueByOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT o.restaurant.id, o.restaurant.name, COUNT(o) as orderCount FROM Order o GROUP BY o.restaurant.id, o.restaurant.name ORDER BY orderCount DESC")
    List<Object[]> findTopRestaurants(Pageable pageable);
}
