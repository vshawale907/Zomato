package com.zomato.clone.controller;

import com.zomato.clone.dto.AdminDashboardDto;
import com.zomato.clone.dto.ApiResponse;
import com.zomato.clone.dto.UserDto;
import com.zomato.clone.entity.Role;
import com.zomato.clone.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getAdminDashboardStats() {
        AdminDashboardDto stats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(new ApiResponse<>(true, "Admin stats loaded", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<UserDto> users = adminService.getAllUsers(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Users loaded", users));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(@PathVariable Long userId, @RequestParam Role role) {
        UserDto updated = adminService.updateUserRole(userId, role);
        return ResponseEntity.ok(new ApiResponse<>(true, "User role updated successfully", updated));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully"));
    }
}
