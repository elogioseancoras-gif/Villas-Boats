package com.villasboats.application.service;

import com.villasboats.domain.entity.Boat;
import com.villasboats.domain.entity.Location;
import com.villasboats.domain.repository.BoatRepository;
import com.villasboats.domain.repository.LocationRepository;
import com.villasboats.domain.valueobject.BoatStatus;
import com.villasboats.domain.valueobject.BoatType;
import com.villasboats.infrastructure.web.dto.request.CreateBoatRequest;
import com.villasboats.infrastructure.web.dto.request.UpdateBoatRequest;
import com.villasboats.infrastructure.web.dto.response.BoatResponse;
import com.villasboats.infrastructure.web.dto.response.LocationResponse;
import com.villasboats.infrastructure.web.dto.response.PageResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoatService {

    private final BoatRepository boatRepository;
    private final LocationRepository locationRepository;

    public List<BoatResponse> getAllBoats() {
        return boatRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public PageResponse<BoatResponse> getBoatsPage(Pageable pageable) {
        Page<Boat> boatsPage = boatRepository.findAll(pageable);

        List<BoatResponse> boats = boatsPage.getContent()
                .stream()
                .map(this::toResponse)
                .toList();

        return PageResponse.<BoatResponse>builder()
                .content(boats)
                .page(PageResponse.PageInfo.builder()
                        .size(boatsPage.getSize())
                        .number(boatsPage.getNumber())
                        .totalElements(boatsPage.getTotalElements())
                        .totalPages(boatsPage.getTotalPages())
                        .build())
                .build();
    }

    public Page<BoatResponse> getBoatsByStatus(BoatStatus status, Pageable pageable) {
        return boatRepository.findByStatus(status, pageable)
                .map(this::toResponse);
    }

    public Page<BoatResponse> getBoatsByType(BoatType type, Pageable pageable) {
        return boatRepository.findByType(type, pageable)
                .map(this::toResponse);
    }

    public Page<BoatResponse> getBoatsByLocation(UUID locationId, Pageable pageable) {
        return boatRepository.findByLocationId(locationId, pageable)
                .map(this::toResponse);
    }

    public Page<BoatResponse> getActiveBoatsByLocation(UUID locationId, Pageable pageable) {
        return boatRepository.findActiveBoatsByLocation(locationId, pageable)
                .map(this::toResponse);
    }

    public Page<BoatResponse> searchBoatsWithFilters(
            BoatType type,
            UUID locationId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minCapacity,
            BigDecimal minRating,
            Pageable pageable) {
        return boatRepository.findBoatsWithFilters(type, locationId, minPrice, maxPrice, minCapacity, minRating, pageable)
                .map(this::toResponse);
    }

    public List<BoatResponse> getPopularBoats(Pageable pageable) {
        return boatRepository.findPopularBoats(pageable).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<BoatResponse> getTopRatedBoats(Pageable pageable) {
        return boatRepository.findTopRatedBoats(pageable).stream()
                .map(this::toResponse)
                .toList();
    }

    public BoatResponse getBoatById(UUID id) {
        Boat boat = findBoatById(id);
        return toResponse(boat);
    }

    public BoatResponse getBoatBySlug(String slug) {
        Boat boat = boatRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Boat not found with slug: " + slug));
        return toResponse(boat);
    }

    @Transactional
    public BoatResponse createBoat(CreateBoatRequest request) {
        if (boatRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Boat with slug already exists: " + request.getSlug());
        }

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + request.getLocationId()));

        Boat boat = Boat.builder()
                .slug(request.getSlug())
                .nameI18n(request.getNameI18n())
                .descriptionI18n(request.getDescriptionI18n())
                .shortDescriptionI18n(request.getShortDescriptionI18n())
                .type(request.getType())
                .status(BoatStatus.ACTIVE)
                .make(request.getMake())
                .model(request.getModel())
                .year(request.getYear())
                .lengthFeet(request.getLengthFeet())
                .capacity(request.getCapacity())
                .cabins(request.getCabins())
                .bathrooms(request.getBathrooms())
                .location(location)
                .pricePerDayUsd(request.getPricePerDayUsd())
                .pricePerDayEur(request.getPricePerDayEur())
                .pricePerDayGbp(request.getPricePerDayGbp())
                .pricePerDayBrl(request.getPricePerDayBrl())
                .captainRequired(request.getCaptainRequired())
                .captainPricePerDayUsd(request.getCaptainPricePerDayUsd())
                .captainPricePerDayEur(request.getCaptainPricePerDayEur())
                .captainPricePerDayGbp(request.getCaptainPricePerDayGbp())
                .captainPricePerDayBrl(request.getCaptainPricePerDayBrl())
                .primaryImageUrl(request.getPrimaryImageUrl())
                .reviewCount(0)
                .totalBookings(0)
                .build();

        boat = boatRepository.save(boat);
        return toResponse(boat);
    }

    @Transactional
    public BoatResponse updateBoat(UUID id, UpdateBoatRequest request) {
        Boat boat = findBoatById(id);

        if (request.getSlug() != null && !request.getSlug().equals(boat.getSlug())) {
            if (boatRepository.existsBySlug(request.getSlug())) {
                throw new IllegalArgumentException("Boat with slug already exists: " + request.getSlug());
            }
            boat.setSlug(request.getSlug());
        }

        if (request.getNameI18n() != null) {
            boat.setNameI18n(request.getNameI18n());
        }
        if (request.getDescriptionI18n() != null) {
            boat.setDescriptionI18n(request.getDescriptionI18n());
        }
        if (request.getShortDescriptionI18n() != null) {
            boat.setShortDescriptionI18n(request.getShortDescriptionI18n());
        }
        if (request.getType() != null) {
            boat.setType(request.getType());
        }
        if (request.getStatus() != null) {
            boat.setStatus(request.getStatus());
        }
        if (request.getMake() != null) {
            boat.setMake(request.getMake());
        }
        if (request.getModel() != null) {
            boat.setModel(request.getModel());
        }
        if (request.getYear() != null) {
            boat.setYear(request.getYear());
        }
        if (request.getLengthFeet() != null) {
            boat.setLengthFeet(request.getLengthFeet());
        }
        if (request.getCapacity() != null) {
            boat.setCapacity(request.getCapacity());
        }
        if (request.getCabins() != null) {
            boat.setCabins(request.getCabins());
        }
        if (request.getBathrooms() != null) {
            boat.setBathrooms(request.getBathrooms());
        }
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + request.getLocationId()));
            boat.setLocation(location);
        }
        if (request.getPricePerDayUsd() != null) {
            boat.setPricePerDayUsd(request.getPricePerDayUsd());
        }
        if (request.getPricePerDayEur() != null) {
            boat.setPricePerDayEur(request.getPricePerDayEur());
        }
        if (request.getPricePerDayGbp() != null) {
            boat.setPricePerDayGbp(request.getPricePerDayGbp());
        }
        if (request.getPricePerDayBrl() != null) {
            boat.setPricePerDayBrl(request.getPricePerDayBrl());
        }
        if (request.getCaptainRequired() != null) {
            boat.setCaptainRequired(request.getCaptainRequired());
        }
        if (request.getCaptainPricePerDayUsd() != null) {
            boat.setCaptainPricePerDayUsd(request.getCaptainPricePerDayUsd());
        }
        if (request.getCaptainPricePerDayEur() != null) {
            boat.setCaptainPricePerDayEur(request.getCaptainPricePerDayEur());
        }
        if (request.getCaptainPricePerDayGbp() != null) {
            boat.setCaptainPricePerDayGbp(request.getCaptainPricePerDayGbp());
        }
        if (request.getCaptainPricePerDayBrl() != null) {
            boat.setCaptainPricePerDayBrl(request.getCaptainPricePerDayBrl());
        }
        if (request.getPrimaryImageUrl() != null) {
            boat.setPrimaryImageUrl(request.getPrimaryImageUrl());
        }

        boat = boatRepository.save(boat);
        return toResponse(boat);
    }

    @Transactional
    public void deleteBoat(UUID id) {
        Boat boat = findBoatById(id);
        boatRepository.delete(boat);
    }

    private Boat findBoatById(UUID id) {
        return boatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Boat not found with id: " + id));
    }

    private BoatResponse toResponse(Boat boat) {
        return BoatResponse.builder()
                .id(boat.getId())
                .slug(boat.getSlug())
                .nameI18n(boat.getNameI18n())
                .descriptionI18n(boat.getDescriptionI18n())
                .shortDescriptionI18n(boat.getShortDescriptionI18n())
                .type(boat.getType())
                .status(boat.getStatus())
                .make(boat.getMake())
                .model(boat.getModel())
                .year(boat.getYear())
                .lengthFeet(boat.getLengthFeet())
                .capacity(boat.getCapacity())
                .cabins(boat.getCabins())
                .bathrooms(boat.getBathrooms())
                .location(toLocationResponse(boat.getLocation()))
                .pricePerDayUsd(boat.getPricePerDayUsd())
                .pricePerDayEur(boat.getPricePerDayEur())
                .pricePerDayGbp(boat.getPricePerDayGbp())
                .pricePerDayBrl(boat.getPricePerDayBrl())
                .captainRequired(boat.getCaptainRequired())
                .captainPricePerDayUsd(boat.getCaptainPricePerDayUsd())
                .captainPricePerDayEur(boat.getCaptainPricePerDayEur())
                .captainPricePerDayGbp(boat.getCaptainPricePerDayGbp())
                .captainPricePerDayBrl(boat.getCaptainPricePerDayBrl())
                .primaryImageUrl(boat.getPrimaryImageUrl())
                .averageRating(boat.getAverageRating())
                .reviewCount(boat.getReviewCount())
                .totalBookings(boat.getTotalBookings())
                .createdAt(boat.getCreatedAt())
                .updatedAt(boat.getUpdatedAt())
                .build();
    }

    private LocationResponse toLocationResponse(Location location) {
        return LocationResponse.builder()
                .id(location.getId())
                .country(location.getCountry())
                .city(location.getCity())
                .region(location.getRegion())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .nameI18n(location.getNameI18n())
                .descriptionI18n(location.getDescriptionI18n())
                .imageUrl(location.getImageUrl())
                .isActive(location.getIsActive())
                .createdAt(location.getCreatedAt())
                .updatedAt(location.getUpdatedAt())
                .build();
    }
}
