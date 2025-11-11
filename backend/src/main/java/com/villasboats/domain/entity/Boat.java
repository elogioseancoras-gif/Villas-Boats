package com.villasboats.domain.entity;

import com.villasboats.domain.valueobject.BoatStatus;
import com.villasboats.domain.valueobject.BoatType;
import com.villasboats.infrastructure.converter.JsonbConverter;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Map;

@Entity
@Table(name = "boats", indexes = {
    @Index(name = "idx_boats_slug", columnList = "slug"),
    @Index(name = "idx_boats_type", columnList = "type"),
    @Index(name = "idx_boats_status", columnList = "status"),
    @Index(name = "idx_boats_location", columnList = "location_id"),
    @Index(name = "idx_boats_price_usd", columnList = "price_per_day_usd"),
    @Index(name = "idx_boats_capacity", columnList = "capacity")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Boat extends BaseEntity {

    @Column(name = "slug", nullable = false, unique = true, length = 255)
    private String slug;

    @Convert(converter = JsonbConverter.class)
    @Column(name = "name_i18n", nullable = false, columnDefinition = "jsonb")
    private Map<String, String> nameI18n;

    @Convert(converter = JsonbConverter.class)
    @Column(name = "description_i18n", nullable = false, columnDefinition = "jsonb")
    private Map<String, String> descriptionI18n;

    @Convert(converter = JsonbConverter.class)
    @Column(name = "short_description_i18n", columnDefinition = "jsonb")
    private Map<String, String> shortDescriptionI18n;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private BoatType type;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private BoatStatus status = BoatStatus.ACTIVE;

    @Column(name = "make", length = 100)
    private String make;

    @Column(name = "model", length = 100)
    private String model;

    @Column(name = "year")
    private Integer year;

    @Column(name = "length_feet", nullable = false)
    private BigDecimal lengthFeet;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "cabins")
    private Integer cabins;

    @Column(name = "bathrooms")
    private Integer bathrooms;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "price_per_day_usd", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDayUsd;

    @Column(name = "price_per_day_eur", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDayEur;

    @Column(name = "price_per_day_gbp", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDayGbp;

    @Column(name = "price_per_day_brl", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDayBrl;

    @Builder.Default
    @Column(name = "captain_required", nullable = false)
    private Boolean captainRequired = false;

    @Column(name = "captain_price_per_day_usd", precision = 10, scale = 2)
    private BigDecimal captainPricePerDayUsd;

    @Column(name = "captain_price_per_day_eur", precision = 10, scale = 2)
    private BigDecimal captainPricePerDayEur;

    @Column(name = "captain_price_per_day_gbp", precision = 10, scale = 2)
    private BigDecimal captainPricePerDayGbp;

    @Column(name = "captain_price_per_day_brl", precision = 10, scale = 2)
    private BigDecimal captainPricePerDayBrl;

    @Column(name = "primary_image_url", length = 500)
    private String primaryImageUrl;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Builder.Default
    @Column(name = "review_count", nullable = false)
    private Integer reviewCount = 0;

    @Builder.Default
    @Column(name = "total_bookings", nullable = false)
    private Integer totalBookings = 0;
}
