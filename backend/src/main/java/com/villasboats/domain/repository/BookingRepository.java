package com.villasboats.domain.repository;

import com.villasboats.domain.entity.Booking;
import com.villasboats.domain.valueobject.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByBookingReference(String bookingReference);

    Page<Booking> findByCustomerId(UUID customerId, Pageable pageable);

    Page<Booking> findByBoatId(UUID boatId, Pageable pageable);

    List<Booking> findByStatus(BookingStatus status);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.customer.id = :customerId
        AND b.status = :status
        ORDER BY b.startDatetime DESC
        """)
    Page<Booking> findByCustomerIdAndStatus(
        @Param("customerId") UUID customerId,
        @Param("status") BookingStatus status,
        Pageable pageable
    );

    @Query("""
        SELECT b FROM Booking b
        WHERE b.boat.id = :boatId
        AND b.status IN :statuses
        AND (
            (b.startDatetime <= :endDatetime AND b.endDatetime >= :startDatetime)
        )
        """)
    List<Booking> findConflictingBookings(
        @Param("boatId") UUID boatId,
        @Param("startDatetime") LocalDateTime startDatetime,
        @Param("endDatetime") LocalDateTime endDatetime,
        @Param("statuses") List<BookingStatus> statuses
    );

    @Query("""
        SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
        FROM Booking b
        WHERE b.boat.id = :boatId
        AND b.status IN ('PENDING', 'CONFIRMED')
        AND (
            (b.startDatetime <= :endDatetime AND b.endDatetime >= :startDatetime)
        )
        """)
    boolean existsConflictingBooking(
        @Param("boatId") UUID boatId,
        @Param("startDatetime") LocalDateTime startDatetime,
        @Param("endDatetime") LocalDateTime endDatetime
    );

    @Query("""
        SELECT b FROM Booking b
        WHERE b.status = 'PENDING'
        AND b.createdAt < :expirationTime
        ORDER BY b.createdAt ASC
        """)
    List<Booking> findExpiredPendingBookings(@Param("expirationTime") LocalDateTime expirationTime);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.customer.id = :customerId
        ORDER BY b.createdAt DESC
        """)
    Page<Booking> findCustomerBookings(@Param("customerId") UUID customerId, Pageable pageable);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.endDatetime < :now
        AND b.status = 'CONFIRMED'
        ORDER BY b.endDatetime DESC
        """)
    List<Booking> findCompletedBookings(@Param("now") LocalDateTime now);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.startDatetime <= :now
        AND b.endDatetime >= :now
        AND b.status = 'CONFIRMED'
        """)
    List<Booking> findActiveBookings(@Param("now") LocalDateTime now);

    @Query("""
        SELECT COUNT(b) FROM Booking b
        WHERE b.boat.id = :boatId
        AND b.status = 'CONFIRMED'
        """)
    long countConfirmedBookingsByBoat(@Param("boatId") UUID boatId);

    @Query("""
        SELECT SUM(b.totalPrice) FROM Booking b
        WHERE b.customer.id = :customerId
        AND b.status IN ('CONFIRMED', 'COMPLETED')
        """)
    BigDecimal calculateTotalSpentByCustomer(@Param("customerId") UUID customerId);

    boolean existsByBookingReference(String bookingReference);
}
