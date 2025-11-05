package com.villasboats.infrastructure.web.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateLocationRequest {

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "City is required")
    private String city;

    private String region;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private Map<String, String> nameI18n;

    private Map<String, String> descriptionI18n;

    private String imageUrl;

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
