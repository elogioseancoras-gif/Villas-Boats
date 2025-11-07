package com.villasboats.application.service;

import com.villasboats.domain.entity.Boat;
import com.villasboats.domain.entity.Booking;
import com.villasboats.domain.entity.Location;
import com.villasboats.domain.entity.User;
import com.villasboats.domain.repository.BoatRepository;
import com.villasboats.domain.repository.BookingRepository;
import com.villasboats.domain.repository.UserRepository;
import com.villasboats.domain.valueobject.*;
import com.villasboats.infrastructure.web.dto.request.CreateBookingRequest;
import com.villasboats.infrastructure.web.dto.request.CreateInquiryRequest;
import com.villasboats.infrastructure.web.dto.request.UpdateBookingRequest;
import com.villasboats.infrastructure.web.dto.response.BoatResponse;
import com.villasboats.infrastructure.web.dto.response.BookingResponse;
import com.villasboats.infrastructure.web.dto.response.CustomerResponse;
import com.villasboats.infrastructure.web.dto.response.LocationResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BoatRepository boatRepository;
    private final UserRepository userRepository;
    private final WebhookService webhookService;

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<BookingResponse> getBookingsPage(Pageable pageable) {
        return bookingRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public Page<BookingResponse> getCustomerBookings(UUID customerId, Pageable pageable) {
        return bookingRepository.findCustomerBookings(customerId, pageable)
                .map(this::toResponse);
    }

    public Page<BookingResponse> getBoatBookings(UUID boatId, Pageable pageable) {
        return bookingRepository.findByBoatId(boatId, pageable)
                .map(this::toResponse);
    }

    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<BookingResponse> getActiveBookings() {
        return bookingRepository.findActiveBookings(LocalDateTime.now()).stream()
                .map(this::toResponse)
                .toList();
    }

    public BookingResponse getBookingById(UUID id) {
        Booking booking = findBookingById(id);
        return toResponse(booking);
    }

    public BookingResponse getBookingByReference(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with reference: " + bookingReference));
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, UUID customerId) {
        // Validate dates
        if (request.getEndDatetime().isBefore(request.getStartDatetime())) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        // Find boat and customer
        Boat boat = boatRepository.findById(request.getBoatId())
                .orElseThrow(() -> new EntityNotFoundException("Boat not found with id: " + request.getBoatId()));
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + customerId));

        // Check boat availability
        if (bookingRepository.existsConflictingBooking(boat.getId(), request.getStartDatetime(), request.getEndDatetime())) {
            throw new IllegalStateException("Boat is not available for the selected dates");
        }

        // Validate guest count
        if (request.getGuestCount() > boat.getCapacity()) {
            throw new IllegalArgumentException("Guest count exceeds boat capacity");
        }

        // Validate captain requirement
        if (boat.getCaptainRequired() && !request.getNeedsCaptain()) {
            throw new IllegalArgumentException("This boat requires a captain");
        }

        // Calculate days
        long days = ChronoUnit.DAYS.between(request.getStartDatetime().toLocalDate(), request.getEndDatetime().toLocalDate());
        if (days < 1) {
            days = 1; // Minimum 1 day
        }

        // Get prices based on currency
        BigDecimal boatPrice = getPriceForCurrency(boat, request.getCurrency());
        BigDecimal captainPrice = request.getNeedsCaptain() ? getCaptainPriceForCurrency(boat, request.getCurrency()) : BigDecimal.ZERO;

        // Calculate totals
        BigDecimal subtotal = boatPrice.multiply(BigDecimal.valueOf(days));
        if (captainPrice.compareTo(BigDecimal.ZERO) > 0) {
            subtotal = subtotal.add(captainPrice.multiply(BigDecimal.valueOf(days)));
        }

        BigDecimal taxPercentage = BigDecimal.valueOf(0); // Can be configured
        BigDecimal taxAmount = subtotal.multiply(taxPercentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalPrice = subtotal.add(taxAmount);

        // Generate unique booking reference
        String bookingReference = generateBookingReference();

        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .boat(boat)
                .customer(customer)
                .startDatetime(request.getStartDatetime())
                .endDatetime(request.getEndDatetime())
                .guestCount(request.getGuestCount())
                .needsCaptain(request.getNeedsCaptain())
                .currency(request.getCurrency())
                .boatPricePerDay(boatPrice)
                .captainPricePerDay(captainPrice)
                .daysCount((int) days)
                .extrasTotal(BigDecimal.ZERO)
                .subtotal(subtotal)
                .taxPercentage(taxPercentage)
                .taxAmount(taxAmount)
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING)
                .customerNotes(request.getCustomerNotes())
                .build();

        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    /**
     * Create a booking inquiry from unauthenticated users.
     * Accepts customer details directly, creates lead user if needed, and triggers n8n workflow.
     *
     * @param request CreateInquiryRequest with booking and customer details
     * @return BookingResponse with inquiry details
     */
    @Transactional
    public BookingResponse createInquiry(CreateInquiryRequest request) {
        // Validate dates - ALLOW SAME DAY BOOKINGS (endDatetime >= startDatetime)
        if (request.getEndDatetime().isBefore(request.getStartDatetime())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        // Find boat
        Boat boat = boatRepository.findById(request.getBoatId())
                .orElseThrow(() -> new EntityNotFoundException("Boat not found with id: " + request.getBoatId()));

        // Find or create lead user (no authentication required)
        User customer = findOrCreateLeadUser(
                request.getEmail(),
                request.getFullName(),
                request.getPhone()
        );

        // Check boat availability
        if (bookingRepository.existsConflictingBooking(boat.getId(), request.getStartDatetime(), request.getEndDatetime())) {
            throw new IllegalStateException("Boat is not available for the selected dates");
        }

        // Validate guest count
        if (request.getGuestCount() > boat.getCapacity()) {
            throw new IllegalArgumentException("Guest count exceeds boat capacity");
        }

        // Validate captain requirement
        if (boat.getCaptainRequired() && !request.getNeedsCaptain()) {
            throw new IllegalArgumentException("This boat requires a captain");
        }

        // Calculate days - same-day bookings count as 1 day
        long days = ChronoUnit.DAYS.between(request.getStartDatetime().toLocalDate(), request.getEndDatetime().toLocalDate());
        if (days < 1) {
            days = 1; // Minimum 1 day (includes same-day bookings)
        }

        // Get prices based on currency
        BigDecimal boatPrice = getPriceForCurrency(boat, request.getCurrency());
        BigDecimal captainPrice = request.getNeedsCaptain() ? getCaptainPriceForCurrency(boat, request.getCurrency()) : BigDecimal.ZERO;

        // Calculate totals
        BigDecimal subtotal = boatPrice.multiply(BigDecimal.valueOf(days));
        if (captainPrice.compareTo(BigDecimal.ZERO) > 0) {
            subtotal = subtotal.add(captainPrice.multiply(BigDecimal.valueOf(days)));
        }

        BigDecimal taxPercentage = BigDecimal.valueOf(0); // Can be configured
        BigDecimal taxAmount = subtotal.multiply(taxPercentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalPrice = subtotal.add(taxAmount);

        // Generate unique booking reference
        String bookingReference = generateBookingReference();

        // Create booking with PENDING status
        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .boat(boat)
                .customer(customer)
                .startDatetime(request.getStartDatetime())
                .endDatetime(request.getEndDatetime())
                .guestCount(request.getGuestCount())
                .needsCaptain(request.getNeedsCaptain())
                .currency(request.getCurrency())
                .boatPricePerDay(boatPrice)
                .captainPricePerDay(captainPrice)
                .daysCount((int) days)
                .extrasTotal(BigDecimal.ZERO)
                .subtotal(subtotal)
                .taxPercentage(taxPercentage)
                .taxAmount(taxAmount)
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING)
                .customerNotes(request.getCustomerNotes())
                .build();

        booking = bookingRepository.save(booking);

        // Emit webhook to n8n for automation (email + WhatsApp)
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            Map<String, Object> webhookPayload = webhookService.buildInquiryPayload(
                    bookingReference,
                    customer.getFullName(),
                    customer.getEmail(),
                    customer.getPhone(),
                    boat.getNameI18n().get("en"), // Default to English name
                    request.getStartDatetime().format(formatter),
                    request.getEndDatetime().format(formatter),
                    request.getGuestCount(),
                    request.getNeedsCaptain(),
                    totalPrice.toString(),
                    request.getCurrency().name(),
                    request.getCustomerNotes()
            );
            webhookService.emitInquiryCreated(webhookPayload);
        } catch (Exception e) {
            // Log error but don't fail booking creation
            System.err.println("Failed to emit inquiry webhook: " + e.getMessage());
        }

        return toResponse(booking);
    }

    /**
     * Find existing user by email or create new lead user with dummy password.
     * Lead users have role CUSTOMER but with a placeholder password.
     *
     * @param email User's email address
     * @param fullName User's full name
     * @param phone User's phone number
     * @return User entity (existing or newly created)
     */
    private User findOrCreateLeadUser(String email, String fullName, String phone) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Create new lead user with dummy password
        User newUser = User.builder()
                .email(email)
                .fullName(fullName)
                .phone(phone)
                .passwordHash("LEAD_USER_NO_PASSWORD") // Dummy password for lead users
                .role(UserRole.CUSTOMER)
                .preferredLanguage(Language.EN)
                .isActive(true) // Lead users are active by default
                .isEmailVerified(false) // Lead users need to verify email later
                .build();

        return userRepository.save(newUser);
    }

    @Transactional
    public BookingResponse updateBooking(UUID id, UpdateBookingRequest request) {
        Booking booking = findBookingById(id);

        if (request.getStatus() != null) {
            updateBookingStatus(booking, request.getStatus());
        }

        if (request.getCustomerNotes() != null) {
            booking.setCustomerNotes(request.getCustomerNotes());
        }

        if (request.getAdminNotes() != null) {
            booking.setAdminNotes(request.getAdminNotes());
        }

        if (request.getCancellationReason() != null) {
            booking.setCancellationReason(request.getCancellationReason());
        }

        if (request.getStartDatetime() != null && request.getEndDatetime() != null) {
            if (request.getEndDatetime().isBefore(request.getStartDatetime())) {
                throw new IllegalArgumentException("End date must be after start date");
            }

            booking.setStartDatetime(request.getStartDatetime());
            booking.setEndDatetime(request.getEndDatetime());

            // Recalculate days and prices
            long days = ChronoUnit.DAYS.between(request.getStartDatetime().toLocalDate(), request.getEndDatetime().toLocalDate());
            if (days < 1) {
                days = 1;
            }
            booking.setDaysCount((int) days);

            BigDecimal subtotal = booking.getBoatPricePerDay().multiply(BigDecimal.valueOf(days));
            if (booking.getCaptainPricePerDay() != null && booking.getCaptainPricePerDay().compareTo(BigDecimal.ZERO) > 0) {
                subtotal = subtotal.add(booking.getCaptainPricePerDay().multiply(BigDecimal.valueOf(days)));
            }
            booking.setSubtotal(subtotal);

            BigDecimal taxAmount = subtotal.multiply(booking.getTaxPercentage()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            booking.setTaxAmount(taxAmount);
            booking.setTotalPrice(subtotal.add(taxAmount));
        }

        if (request.getGuestCount() != null) {
            if (request.getGuestCount() > booking.getBoat().getCapacity()) {
                throw new IllegalArgumentException("Guest count exceeds boat capacity");
            }
            booking.setGuestCount(request.getGuestCount());
        }

        if (request.getNeedsCaptain() != null) {
            booking.setNeedsCaptain(request.getNeedsCaptain());
        }

        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse confirmBooking(UUID id) {
        Booking booking = findBookingById(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be confirmed");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setConfirmedAt(LocalDateTime.now());

        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(UUID id, String reason) {
        Booking booking = findBookingById(id);

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a " + booking.getStatus().name().toLowerCase() + " booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(reason);

        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Transactional
    public void deleteBooking(UUID id) {
        Booking booking = findBookingById(id);
        bookingRepository.delete(booking);
    }

    private void updateBookingStatus(Booking booking, BookingStatus newStatus) {
        BookingStatus currentStatus = booking.getStatus();

        if (currentStatus == newStatus) {
            return;
        }

        booking.setStatus(newStatus);

        switch (newStatus) {
            case CONFIRMED -> booking.setConfirmedAt(LocalDateTime.now());
            case CANCELLED -> booking.setCancelledAt(LocalDateTime.now());
            case COMPLETED -> booking.setCompletedAt(LocalDateTime.now());
        }
    }

    private String generateBookingReference() {
        String reference;
        do {
            reference = "BK" + System.currentTimeMillis() + (int)(Math.random() * 1000);
        } while (bookingRepository.existsByBookingReference(reference));
        return reference;
    }

    private BigDecimal getPriceForCurrency(Boat boat, Currency currency) {
        return switch (currency) {
            case USD -> boat.getPricePerDayUsd();
            case EUR -> boat.getPricePerDayEur();
            case GBP -> boat.getPricePerDayGbp();
            case BRL -> boat.getPricePerDayBrl();
        };
    }

    private BigDecimal getCaptainPriceForCurrency(Boat boat, Currency currency) {
        BigDecimal price = switch (currency) {
            case USD -> boat.getCaptainPricePerDayUsd();
            case EUR -> boat.getCaptainPricePerDayEur();
            case GBP -> boat.getCaptainPricePerDayGbp();
            case BRL -> boat.getCaptainPricePerDayBrl();
        };
        return price != null ? price : BigDecimal.ZERO;
    }

    private Booking findBookingById(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .boat(toBoatResponse(booking.getBoat()))
                .customer(toCustomerResponse(booking.getCustomer()))
                .startDatetime(booking.getStartDatetime())
                .endDatetime(booking.getEndDatetime())
                .guestCount(booking.getGuestCount())
                .needsCaptain(booking.getNeedsCaptain())
                .currency(booking.getCurrency())
                .boatPricePerDay(booking.getBoatPricePerDay())
                .captainPricePerDay(booking.getCaptainPricePerDay())
                .daysCount(booking.getDaysCount())
                .extrasTotal(booking.getExtrasTotal())
                .subtotal(booking.getSubtotal())
                .taxPercentage(booking.getTaxPercentage())
                .taxAmount(booking.getTaxAmount())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .customerNotes(booking.getCustomerNotes())
                .adminNotes(booking.getAdminNotes())
                .confirmedAt(booking.getConfirmedAt())
                .cancelledAt(booking.getCancelledAt())
                .cancellationReason(booking.getCancellationReason())
                .completedAt(booking.getCompletedAt())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    private BoatResponse toBoatResponse(Boat boat) {
        return BoatResponse.builder()
                .id(boat.getId())
                .slug(boat.getSlug())
                .nameI18n(boat.getNameI18n())
                .descriptionI18n(boat.getDescriptionI18n())
                .shortDescriptionI18n(boat.getShortDescriptionI18n())
                .type(boat.getType())
                .status(boat.getStatus())
                .make(boat.getMake())
                .model(boat.getModel())
                .year(boat.getYear())
                .lengthFeet(boat.getLengthFeet())
                .capacity(boat.getCapacity())
                .cabins(boat.getCabins())
                .bathrooms(boat.getBathrooms())
                .location(toLocationResponse(boat.getLocation()))
                .pricePerDayUsd(boat.getPricePerDayUsd())
                .pricePerDayEur(boat.getPricePerDayEur())
                .pricePerDayGbp(boat.getPricePerDayGbp())
                .pricePerDayBrl(boat.getPricePerDayBrl())
                .captainRequired(boat.getCaptainRequired())
                .captainPricePerDayUsd(boat.getCaptainPricePerDayUsd())
                .captainPricePerDayEur(boat.getCaptainPricePerDayEur())
                .captainPricePerDayGbp(boat.getCaptainPricePerDayGbp())
                .captainPricePerDayBrl(boat.getCaptainPricePerDayBrl())
                .primaryImageUrl(boat.getPrimaryImageUrl())
                .averageRating(boat.getAverageRating())
                .reviewCount(boat.getReviewCount())
                .totalBookings(boat.getTotalBookings())
                .createdAt(boat.getCreatedAt())
                .updatedAt(boat.getUpdatedAt())
                .build();
    }

    private LocationResponse toLocationResponse(Location location) {
        return LocationResponse.builder()
                .id(location.getId())
                .country(location.getCountry())
                .city(location.getCity())
                .region(location.getRegion())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .nameI18n(location.getNameI18n())
                .descriptionI18n(location.getDescriptionI18n())
                .imageUrl(location.getImageUrl())
                .isActive(location.getIsActive())
                .createdAt(location.getCreatedAt())
                .updatedAt(location.getUpdatedAt())
                .build();
    }

    private CustomerResponse toCustomerResponse(User user) {
        return CustomerResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhone())
                .preferredLanguage(user.getPreferredLanguage())
                .build();
    }
}
