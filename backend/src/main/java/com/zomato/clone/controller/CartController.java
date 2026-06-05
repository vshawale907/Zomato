package com.zomato.clone.controller;

import com.zomato.clone.dto.ApiResponse;
import com.zomato.clone.dto.CartDto;
import com.zomato.clone.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(Principal principal) {
        CartDto cart = cartService.getCart(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart loaded successfully", cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addItemToCart(
            Principal principal,
            @RequestParam Long menuItemId,
            @RequestParam(defaultValue = "1") Integer quantity) {

        CartDto cart = cartService.addItemToCart(principal.getName(), menuItemId, quantity);
        return ResponseEntity.ok(new ApiResponse<>(true, "Item added to cart", cart));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateItemQuantity(
            Principal principal,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {

        CartDto cart = cartService.updateItemQuantity(principal.getName(), cartItemId, quantity);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart updated successfully", cart));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeItemFromCart(Principal principal, @PathVariable Long cartItemId) {
        CartDto cart = cartService.removeItemFromCart(principal.getName(), cartItemId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Item removed from cart", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart cleared successfully"));
    }
}
