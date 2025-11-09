package com.villasboats.infrastructure.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {

    private Long totalBookings;
    private Long pendingBookings;
    private Long confirmedBookings;
    private Long completedBookings;
    private Long activeBoats;
    private Long totalLocations;
    private BigDecimal totalRevenue;
    private Long uniqueCustomers;
    private BookingsTrend bookingsTrend;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingsTrend {
        private Long current30Days;
        private Long previous30Days;
        private Double percentChange;
    }
}
