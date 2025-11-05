package com.villasboats.application.service;

import com.villasboats.domain.entity.Location;
import com.villasboats.domain.repository.LocationRepository;
import com.villasboats.infrastructure.web.dto.request.CreateLocationRequest;
import com.villasboats.infrastructure.web.dto.request.UpdateLocationRequest;
import com.villasboats.infrastructure.web.dto.response.LocationResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationService {

    private final LocationRepository locationRepository;

    public List<LocationResponse> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<LocationResponse> getLocationsPage(Pageable pageable) {
        return locationRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public List<LocationResponse> getActiveLocations() {
        return locationRepository.findByIsActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    public LocationResponse getLocationById(UUID id) {
        Location location = findLocationById(id);
        return toResponse(location);
    }

    @Transactional
    public LocationResponse createLocation(CreateLocationRequest request) {
        Location location = Location.builder()
                .country(request.getCountry())
                .city(request.getCity())
                .region(request.getRegion())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .nameI18n(request.getNameI18n())
                .descriptionI18n(request.getDescriptionI18n())
                .imageUrl(request.getImageUrl())
                .isActive(request.getIsActive())
                .build();

        location = locationRepository.save(location);
        return toResponse(location);
    }

    @Transactional
    public LocationResponse updateLocation(UUID id, UpdateLocationRequest request) {
        Location location = findLocationById(id);

        if (request.getCountry() != null) {
            location.setCountry(request.getCountry());
        }
        if (request.getCity() != null) {
            location.setCity(request.getCity());
        }
        if (request.getRegion() != null) {
            location.setRegion(request.getRegion());
        }
        if (request.getLatitude() != null) {
            location.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            location.setLongitude(request.getLongitude());
        }
        if (request.getNameI18n() != null) {
            location.setNameI18n(request.getNameI18n());
        }
        if (request.getDescriptionI18n() != null) {
            location.setDescriptionI18n(request.getDescriptionI18n());
        }
        if (request.getImageUrl() != null) {
            location.setImageUrl(request.getImageUrl());
        }
        if (request.getIsActive() != null) {
            location.setIsActive(request.getIsActive());
        }

        location = locationRepository.save(location);
        return toResponse(location);
    }

    @Transactional
    public void deleteLocation(UUID id) {
        Location location = findLocationById(id);
        locationRepository.delete(location);
    }

    private Location findLocationById(UUID id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
    }

    private LocationResponse toResponse(Location location) {
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
