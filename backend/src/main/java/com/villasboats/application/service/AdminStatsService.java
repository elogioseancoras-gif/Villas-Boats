package com.villasboats.application.service;

import com.villasboats.domain.repository.BoatRepository;
import com.villasboats.domain.repository.BookingRepository;
import com.villasboats.domain.repository.LocationRepository;
import com.villasboats.domain.valueobject.BookingStatus;
import com.villasboats.infrastructure.web.dto.response.AdminStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatsService {

    private final BookingRepository bookingRepository;
    private final BoatRepository boatRepository;
    private final LocationRepository locationRepository;

    public AdminStatsResponse getStatistics() {
        // Calculate basic counts
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long completedBookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long activeBoats = boatRepository.countActiveBoats();
        long totalLocations = locationRepository.count();
        long uniqueCustomers = bookingRepository.countUniqueCustomers();

        // Calculate total revenue (CONFIRMED and COMPLETED only)
        BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        // Calculate booking trend (last 30 days vs previous 30 days)
        AdminStatsResponse.BookingsTrend trend = calculateBookingsTrend();

        return AdminStatsResponse.builder()
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .confirmedBookings(confirmedBookings)
                .completedBookings(completedBookings)
                .activeBoats(activeBoats)
                .totalLocations(totalLocations)
                .totalRevenue(totalRevenue)
                .uniqueCustomers(uniqueCustomers)
                .bookingsTrend(trend)
                .build();
    }

    private AdminStatsResponse.BookingsTrend calculateBookingsTrend() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        LocalDateTime sixtyDaysAgo = now.minusDays(60);

        // Count bookings in last 30 days
        long current30Days = bookingRepository.countBookingsInDateRange(thirtyDaysAgo, now);

        // Count bookings in previous 30 days (31-60 days ago)
        long previous30Days = bookingRepository.countBookingsInDateRange(sixtyDaysAgo, thirtyDaysAgo);

        // Calculate percentage change
        Double percentChange = 0.0;
        if (previous30Days > 0) {
            percentChange = ((double) (current30Days - previous30Days) / previous30Days) * 100;
            // Round to 2 decimal places
            percentChange = BigDecimal.valueOf(percentChange)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
        } else if (current30Days > 0) {
            percentChange = 100.0; // If there were no bookings before but there are now, it's a 100% increase
        }

        return AdminStatsResponse.BookingsTrend.builder()
                .current30Days(current30Days)
                .previous30Days(previous30Days)
                .percentChange(percentChange)
                .build();
    }
}
