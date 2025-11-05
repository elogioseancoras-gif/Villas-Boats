package com.villasboats.infrastructure.web.dto.request;

import com.villasboats.domain.valueobject.BoatStatus;
import com.villasboats.domain.valueobject.BoatType;
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
public class UpdateBoatRequest {

    private String slug;
    private Map<String, String> nameI18n;
    private Map<String, String> descriptionI18n;
    private Map<String, String> shortDescriptionI18n;
    private BoatType type;
    private BoatStatus status;
    private String make;
    private String model;
    private Integer year;
    private BigDecimal lengthFeet;
    private Integer capacity;
    private Integer cabins;
    private Integer bathrooms;
    private UUID locationId;
    private BigDecimal pricePerDayUsd;
    private BigDecimal pricePerDayEur;
    private BigDecimal pricePerDayGbp;
    private BigDecimal pricePerDayBrl;
    private Boolean captainRequired;
    private BigDecimal captainPricePerDayUsd;
    private BigDecimal captainPricePerDayEur;
    private BigDecimal captainPricePerDayGbp;
    private BigDecimal captainPricePerDayBrl;
    private String primaryImageUrl;
}
