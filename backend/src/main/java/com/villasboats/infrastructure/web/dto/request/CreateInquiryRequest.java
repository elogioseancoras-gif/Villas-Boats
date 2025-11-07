package com.villasboats.infrastructure.web.dto.request;

import com.villasboats.domain.valueobject.Currency;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Request DTO for creating a booking inquiry from unauthenticated users.
 * Includes both booking details and customer information for lead capture.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInquiryRequest {

    // ========== BOOKING FIELDS ==========

    @NotNull(message = "Boat ID is required")
    private UUID boatId;

    @NotNull(message = "Start date and time is required")
    @Future(message = "Start date must be in the future")
    private LocalDateTime startDatetime;

    @NotNull(message = "End date and time is required")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDatetime;

    @NotNull(message = "Guest count is required")
    @Positive(message = "Guest count must be positive")
    private Integer guestCount;

    @NotNull(message = "Needs captain flag is required")
    private Boolean needsCaptain;

    @NotNull(message = "Currency is required")
    private Currency currency;

    // ========== CUSTOMER FIELDS (NO AUTH REQUIRED) ==========

    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name cannot exceed 255 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 50, message = "Phone number cannot exceed 50 characters")
    private String phone;

    @Size(max = 1000, message = "Customer notes cannot exceed 1000 characters")
    private String customerNotes;
}
