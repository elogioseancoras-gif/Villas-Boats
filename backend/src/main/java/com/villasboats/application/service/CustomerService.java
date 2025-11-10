package com.villasboats.application.service;

import com.villasboats.domain.entity.User;
import com.villasboats.domain.repository.BookingRepository;
import com.villasboats.domain.repository.UserRepository;
import com.villasboats.domain.valueobject.BookingStatus;
import com.villasboats.infrastructure.web.dto.response.BookingResponse;
import com.villasboats.infrastructure.web.dto.response.CustomerWithStatsResponse;
import com.villasboats.infrastructure.web.dto.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public PageResponse<CustomerWithStatsResponse> getCustomers(String search, Pageable pageable) {
        Page<User> usersPage;

        if (search != null && !search.isBlank()) {
            // For now, use findAll - search filtering can be added later with repository method
            usersPage = userRepository.findAll(pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        List<CustomerWithStatsResponse> customers = usersPage.getContent()
                .stream()
                .map(this::toCustomerWithStats)
                .collect(Collectors.toList());

        return PageResponse.<CustomerWithStatsResponse>builder()
                .content(customers)
                .page(PageResponse.PageInfo.builder()
                        .size(usersPage.getSize())
                        .number(usersPage.getNumber())
                        .totalElements(usersPage.getTotalElements())
                        .totalPages(usersPage.getTotalPages())
                        .build())
                .build();
    }

    public CustomerWithStatsResponse getCustomerById(UUID customerId) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));

        return toCustomerWithStats(user);
    }

    public PageResponse<BookingResponse> getCustomerBookings(UUID customerId, Pageable pageable) {
        // Verify customer exists
        if (!userRepository.existsById(customerId)) {
            throw new RuntimeException("Customer not found with id: " + customerId);
        }

        // Delegate to BookingService which already returns PageResponse
        return bookingService.getCustomerBookings(customerId, pageable);
    }

    private CustomerWithStatsResponse toCustomerWithStats(User user) {
        // Calculate statistics from bookings
        Long bookingCount = bookingRepository.countByCustomerId(user.getId());

        BigDecimal totalSpent = bookingRepository.sumTotalPriceByCustomerIdAndStatus(
                user.getId(),
                List.of(BookingStatus.CONFIRMED, BookingStatus.COMPLETED)
        );

        LocalDateTime lastBookingDate = bookingRepository.findLatestBookingDateByCustomerId(user.getId());

        return CustomerWithStatsResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhone())
                .preferredLanguage(user.getPreferredLanguage())
                .bookingCount(bookingCount)
                .totalSpent(totalSpent != null ? totalSpent : BigDecimal.ZERO)
                .lastBookingDate(lastBookingDate)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
