package com.villasboats.infrastructure.web.dto.response;

import com.villasboats.domain.valueobject.BookingStatus;
import com.villasboats.domain.valueobject.Currency;
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
public class BookingResponse {

    private UUID id;
    private String bookingReference;
    private BoatResponse boat;
    private CustomerResponse customer;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private Integer guestCount;
    private Boolean needsCaptain;
    private Currency currency;
    private BigDecimal boatPricePerDay;
    private BigDecimal captainPricePerDay;
    private Integer daysCount;
    private BigDecimal extrasTotal;
    private BigDecimal subtotal;
    private BigDecimal taxPercentage;
    private BigDecimal taxAmount;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private String customerNotes;
    private String adminNotes;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
