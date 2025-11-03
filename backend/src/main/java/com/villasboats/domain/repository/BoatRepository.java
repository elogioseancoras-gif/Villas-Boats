package com.villasboats.domain.repository;

import com.villasboats.domain.entity.Boat;
import com.villasboats.domain.valueobject.BoatStatus;
import com.villasboats.domain.valueobject.BoatType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BoatRepository extends JpaRepository<Boat, UUID> {

    Optional<Boat> findBySlug(String slug);

    Page<Boat> findByStatus(BoatStatus status, Pageable pageable);

    Page<Boat> findByType(BoatType type, Pageable pageable);

    Page<Boat> findByLocationId(UUID locationId, Pageable pageable);

    @Query("""
        SELECT b FROM Boat b
        WHERE b.status = 'ACTIVE'
        AND b.location.id = :locationId
        ORDER BY b.averageRating DESC NULLS LAST
        """)
    Page<Boat> findActiveBoatsByLocation(@Param("locationId") UUID locationId, Pageable pageable);

    @Query("""
        SELECT b FROM Boat b
        WHERE b.status = 'ACTIVE'
        AND b.type = :type
        AND b.pricePerDayUsd BETWEEN :minPrice AND :maxPrice
        AND b.capacity >= :minCapacity
        ORDER BY b.averageRating DESC NULLS LAST, b.pricePerDayUsd ASC
        """)
    Page<Boat> searchBoats(
        @Param("type") BoatType type,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("minCapacity") Integer minCapacity,
        Pageable pageable
    );

    @Query("""
        SELECT b FROM Boat b
        WHERE b.status = 'ACTIVE'
        AND (:type IS NULL OR b.type = :type)
        AND (:locationId IS NULL OR b.location.id = :locationId)
        AND b.pricePerDayUsd >= :minPrice
        AND (:maxPrice IS NULL OR b.pricePerDayUsd <= :maxPrice)
        AND b.capacity >= :minCapacity
        AND (:minRating IS NULL OR b.averageRating >= :minRating)
        ORDER BY b.averageRating DESC NULLS LAST
        """)
    Page<Boat> findBoatsWithFilters(
        @Param("type") BoatType type,
        @Param("locationId") UUID locationId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("minCapacity") Integer minCapacity,
        @Param("minRating") BigDecimal minRating,
        Pageable pageable
    );

    @Query("""
        SELECT b FROM Boat b
        WHERE b.status = 'ACTIVE'
        ORDER BY b.totalBookings DESC
        """)
    List<Boat> findPopularBoats(Pageable pageable);

    @Query("""
        SELECT b FROM Boat b
        WHERE b.status = 'ACTIVE'
        AND b.averageRating IS NOT NULL
        ORDER BY b.averageRating DESC, b.reviewCount DESC
        """)
    List<Boat> findTopRatedBoats(Pageable pageable);

    boolean existsBySlug(String slug);

    @Query("""
        SELECT COUNT(b) FROM Boat b
        WHERE b.status = 'ACTIVE'
        AND b.location.id = :locationId
        """)
    long countActiveBoatsByLocation(@Param("locationId") UUID locationId);
}
