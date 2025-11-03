package com.villasboats.domain.repository;

import com.villasboats.domain.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LocationRepository extends JpaRepository<Location, UUID> {

    List<Location> findByIsActiveTrue();

    List<Location> findByCountry(String country);

    List<Location> findByCountryAndCity(String country, String city);

    @Query("SELECT l FROM Location l WHERE l.isActive = true AND l.country = :country")
    List<Location> findActiveLocationsByCountry(@Param("country") String country);

    @Query("SELECT DISTINCT l.country FROM Location l WHERE l.isActive = true ORDER BY l.country")
    List<String> findAllActiveCountries();

    @Query("SELECT DISTINCT l.city FROM Location l WHERE l.isActive = true AND l.country = :country ORDER BY l.city")
    List<String> findCitiesByCountry(@Param("country") String country);

    @Query(value = """
        SELECT * FROM locations l
        WHERE l.is_active = true
        AND l.latitude IS NOT NULL
        AND l.longitude IS NOT NULL
        ORDER BY ST_Distance(
            ST_MakePoint(l.longitude, l.latitude)::geography,
            ST_MakePoint(:longitude, :latitude)::geography
        )
        LIMIT :limit
        """, nativeQuery = true)
    List<Location> findNearbyLocations(
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("limit") int limit
    );
}
