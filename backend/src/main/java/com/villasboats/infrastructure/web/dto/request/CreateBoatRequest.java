package com.villasboats.infrastructure.web.dto.request;

import com.villasboats.domain.valueobject.BoatType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBoatRequest {

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotNull(message = "Name (i18n) is required")
    private Map<String, String> nameI18n;

    @NotNull(message = "Description (i18n) is required")
    private Map<String, String> descriptionI18n;

    private Map<String, String> shortDescriptionI18n;

    @NotNull(message = "Boat type is required")
    private BoatType type;

    private String make;
    private String model;
    private Integer year;

    @NotNull(message = "Length in feet is required")
    @Positive(message = "Length must be positive")
    private BigDecimal lengthFeet;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    private Integer cabins;
    private Integer bathrooms;

    @NotNull(message = "Location ID is required")
    private UUID locationId;

    @NotNull(message = "Price per day (USD) is required")
    @Positive(message = "Price (USD) must be positive")
    private BigDecimal pricePerDayUsd;

    @NotNull(message = "Price per day (EUR) is required")
    @Positive(message = "Price (EUR) must be positive")
    private BigDecimal pricePerDayEur;

    @NotNull(message = "Price per day (GBP) is required")
    @Positive(message = "Price (GBP) must be positive")
    private BigDecimal pricePerDayGbp;

    @NotNull(message = "Price per day (BRL) is required")
    @Positive(message = "Price (BRL) must be positive")
    private BigDecimal pricePerDayBrl;

    @NotNull(message = "Captain required flag is required")
    private Boolean captainRequired;

    private BigDecimal captainPricePerDayUsd;
    private BigDecimal captainPricePerDayEur;
    private BigDecimal captainPricePerDayGbp;
    private BigDecimal captainPricePerDayBrl;

    private String primaryImageUrl;
}
