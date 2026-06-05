package com.zomato.clone.controller;

import com.zomato.clone.dto.AddressDto;
import com.zomato.clone.dto.ApiResponse;
import com.zomato.clone.dto.PasswordChangeRequest;
import com.zomato.clone.dto.UserDto;
import com.zomato.clone.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Principal principal) {
        UserDto profile = userService.getProfile(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile loaded", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(Principal principal, @Valid @RequestBody UserDto userDto) {
        UserDto updated = userService.updateProfile(principal.getName(), userDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updated));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(Principal principal, @Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(principal.getName(), request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully"));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getSavedAddresses(Principal principal) {
        List<AddressDto> addresses = userService.getSavedAddresses(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Addresses loaded", addresses));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(Principal principal, @Valid @RequestBody AddressDto addressDto) {
        AddressDto saved = userService.addAddress(principal.getName(), addressDto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Address added successfully", saved), HttpStatus.CREATED);
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(Principal principal, @PathVariable Long addressId, @Valid @RequestBody AddressDto addressDto) {
        AddressDto updated = userService.updateAddress(principal.getName(), addressId, addressDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address updated successfully", updated));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(Principal principal, @PathVariable Long addressId) {
        userService.deleteAddress(principal.getName(), addressId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address deleted successfully"));
    }
}
