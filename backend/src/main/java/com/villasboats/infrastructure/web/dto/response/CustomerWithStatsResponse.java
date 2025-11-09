package com.villasboats.infrastructure.web.dto.response;

import com.villasboats.domain.valueobject.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerWithStatsResponse {

    private UUID id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Language preferredLanguage;
    private Long bookingCount;
    private BigDecimal totalSpent;
    private LocalDateTime lastBookingDate;
    private LocalDateTime createdAt;
}
