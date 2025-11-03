package com.villasboats.infrastructure.web.dto.response;

import com.villasboats.domain.valueobject.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType;
    private Long expiresIn;

    private UUID userId;
    private String email;
    private String fullName;
    private UserRole role;
    private Boolean isActive;
    private LocalDateTime loginAt;
}
