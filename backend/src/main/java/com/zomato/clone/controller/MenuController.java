package com.zomato.clone.controller;

import com.zomato.clone.dto.ApiResponse;
import com.zomato.clone.dto.MenuItemDto;
import com.zomato.clone.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getMenuItems(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean veg,
            @RequestParam(required = false) String search) {

        List<MenuItemDto> items = menuService.getMenuItems(restaurantId, category, veg, search);
        return ResponseEntity.ok(new ApiResponse<>(true, "Menu items loaded successfully", items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDto>> getMenuItemById(@PathVariable Long id) {
        MenuItemDto item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Menu item details loaded", item));
    }
}
