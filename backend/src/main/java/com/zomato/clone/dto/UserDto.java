package com.zomato.clone.dto;

import com.zomato.clone.entity.Role;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String profileImage;
    private Role role;
    private List<AddressDto> addresses;
    private LocalDateTime createdAt;
}
