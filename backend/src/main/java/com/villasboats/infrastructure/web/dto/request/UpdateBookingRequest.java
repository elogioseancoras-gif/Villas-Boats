package com.villasboats.infrastructure.web.dto.request;

import com.villasboats.domain.valueobject.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateBookingRequest {

    private BookingStatus status;
    private String customerNotes;
    private String adminNotes;
    private String cancellationReason;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private Integer guestCount;
    private Boolean needsCaptain;
}
