package com.villasboats.infrastructure.web.controller;

import com.villasboats.application.service.CustomerService;
import com.villasboats.infrastructure.web.dto.response.BookingResponse;
import com.villasboats.infrastructure.web.dto.response.CustomerWithStatsResponse;
import com.villasboats.infrastructure.web.dto.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<CustomerWithStatsResponse>> getCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {

        String mappedSortBy = mapSortFieldToEntity(sortBy);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, mappedSortBy));
        PageResponse<CustomerWithStatsResponse> response = customerService.getCustomers(search, pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * Maps DTO field names to valid User entity field names for sorting.
     * Computed fields in CustomerWithStatsResponse (like lastBookingDate, bookingCount, totalSpent)
     * don't exist on the User entity, so we map them to appropriate entity fields.
     */
    private String mapSortFieldToEntity(String sortBy) {
        return switch (sortBy) {
            case "lastBookingDate" -> "createdAt"; // Map to user creation date as approximation
            case "bookingCount", "totalSpent" -> "createdAt"; // Computed fields, use default
            case "fullName" -> "fullName"; // Valid entity field
            case "email" -> "email"; // Valid entity field
            case "phoneNumber" -> "phone"; // Map DTO field to entity field
            case "preferredLanguage" -> "preferredLanguage"; // Valid entity field
            default -> "createdAt"; // Safe default
        };
    }

    @GetMapping("/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerWithStatsResponse> getCustomerById(@PathVariable UUID customerId) {
        CustomerWithStatsResponse customer = customerService.getCustomerById(customerId);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("/{customerId}/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<BookingResponse>> getCustomerBookings(
            @PathVariable UUID customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<BookingResponse> response = customerService.getCustomerBookings(customerId, pageable);

        return ResponseEntity.ok(response);
    }
}
