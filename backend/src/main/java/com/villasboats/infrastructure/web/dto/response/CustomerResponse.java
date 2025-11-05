package com.villasboats.infrastructure.web.dto.response;

import com.villasboats.domain.valueobject.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {

    private UUID id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Language preferredLanguage;
}
