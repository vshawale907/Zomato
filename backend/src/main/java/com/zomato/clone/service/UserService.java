package com.zomato.clone.service;

import com.zomato.clone.dto.AddressDto;
import com.zomato.clone.dto.UserDto;
import com.zomato.clone.entity.Address;
import com.zomato.clone.entity.User;
import com.zomato.clone.exception.BadRequestException;
import com.zomato.clone.exception.ResourceNotFoundException;
import com.zomato.clone.repository.AddressRepository;
import com.zomato.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    @Transactional(readOnly = true)
    public UserDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToFullUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(String email, UserDto userDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFullName(userDto.getFullName());
        user.setPhone(userDto.getPhone());
        if (userDto.getProfileImage() != null) {
            user.setProfileImage(userDto.getProfileImage());
        }

        User updatedUser = userRepository.save(user);
        return mapToFullUserDto(updatedUser);
    }

    @Transactional
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public List<AddressDto> getSavedAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToAddressDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto addAddress(String email, AddressDto addressDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (addressDto.isDefault()) {
            clearDefaults(user.getId());
        }

        Address address = Address.builder()
                .street(addressDto.getStreet())
                .city(addressDto.getCity())
                .state(addressDto.getState())
                .zipCode(addressDto.getZipCode())
                .isDefault(addressDto.isDefault())
                .user(user)
                .build();

        Address saved = addressRepository.save(address);
        return mapToAddressDto(saved);
    }

    @Transactional
    public AddressDto updateAddress(String email, Long addressId, AddressDto addressDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to address");
        }

        if (addressDto.isDefault() && !address.isDefault()) {
            clearDefaults(user.getId());
        }

        address.setStreet(addressDto.getStreet());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setZipCode(addressDto.getZipCode());
        address.setDefault(addressDto.isDefault());

        Address updated = addressRepository.save(address);
        return mapToAddressDto(updated);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to address");
        }

        addressRepository.delete(address);
    }

    private void clearDefaults(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        for (Address addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    public UserDto mapToFullUserDto(User user) {
        UserDto dto = authService.mapToUserDto(user);
        if (dto != null && user.getAddresses() != null) {
            dto.setAddresses(user.getAddresses().stream()
                    .map(this::mapToAddressDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public AddressDto mapToAddressDto(Address address) {
        if (address == null) return null;
        return AddressDto.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .isDefault(address.isDefault())
                .build();
    }
}
