package com.villasboats.infrastructure.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLocationRequest {

    private String country;
    private String city;
    private String region;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Map<String, String> nameI18n;
    private Map<String, String> descriptionI18n;
    private String imageUrl;
    private Boolean isActive;
}
