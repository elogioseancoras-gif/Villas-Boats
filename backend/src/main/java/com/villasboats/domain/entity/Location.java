package com.villasboats.domain.entity;

import com.villasboats.infrastructure.converter.JsonbConverter;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Map;

@Entity
@Table(name = "locations", indexes = {
    @Index(name = "idx_locations_country", columnList = "country"),
    @Index(name = "idx_locations_city", columnList = "city")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location extends BaseEntity {

    @Column(name = "country", nullable = false, length = 100)
    private String country;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "region", length = 100)
    private String region;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    @Convert(converter = JsonbConverter.class)
    @Column(name = "name_i18n", columnDefinition = "jsonb")
    private Map<String, String> nameI18n;

    @Convert(converter = JsonbConverter.class)
    @Column(name = "description_i18n", columnDefinition = "jsonb")
    private Map<String, String> descriptionI18n;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
