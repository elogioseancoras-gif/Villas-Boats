package com.villasboats.infrastructure.web.controller;

import com.villasboats.application.service.BoatService;
import com.villasboats.domain.valueobject.BoatStatus;
import com.villasboats.domain.valueobject.BoatType;
import com.villasboats.infrastructure.web.dto.request.CreateBoatRequest;
import com.villasboats.infrastructure.web.dto.request.UpdateBoatRequest;
import com.villasboats.infrastructure.web.dto.response.BoatResponse;
import com.villasboats.infrastructure.web.dto.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/boats")
@RequiredArgsConstructor
public class BoatController {

    private final BoatService boatService;

    @GetMapping
    public ResponseEntity<List<BoatResponse>> getAllBoats() {
        return ResponseEntity.ok(boatService.getAllBoats());
    }

    @GetMapping("/page")
    public ResponseEntity<PageResponse<BoatResponse>> getBoatsPage(Pageable pageable) {
        return ResponseEntity.ok(boatService.getBoatsPage(pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<BoatResponse>> getBoatsByStatus(
            @PathVariable BoatStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(boatService.getBoatsByStatus(status, pageable));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Page<BoatResponse>> getBoatsByType(
            @PathVariable BoatType type,
            Pageable pageable) {
        return ResponseEntity.ok(boatService.getBoatsByType(type, pageable));
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<Page<BoatResponse>> getBoatsByLocation(
            @PathVariable UUID locationId,
            Pageable pageable) {
        return ResponseEntity.ok(boatService.getBoatsByLocation(locationId, pageable));
    }

    @GetMapping("/location/{locationId}/active")
    public ResponseEntity<Page<BoatResponse>> getActiveBoatsByLocation(
            @PathVariable UUID locationId,
            Pageable pageable) {
        return ResponseEntity.ok(boatService.getActiveBoatsByLocation(locationId, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BoatResponse>> searchBoats(
            @RequestParam(required = false) BoatType type,
            @RequestParam(required = false) UUID locationId,
            @RequestParam(defaultValue = "0") BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "1") Integer minCapacity,
            @RequestParam(required = false) BigDecimal minRating,
            Pageable pageable) {
        return ResponseEntity.ok(boatService.searchBoatsWithFilters(
                type, locationId, minPrice, maxPrice, minCapacity, minRating, pageable));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<BoatResponse>> getPopularBoats(Pageable pageable) {
        return ResponseEntity.ok(boatService.getPopularBoats(pageable));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<BoatResponse>> getTopRatedBoats(Pageable pageable) {
        return ResponseEntity.ok(boatService.getTopRatedBoats(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoatResponse> getBoatById(@PathVariable UUID id) {
        return ResponseEntity.ok(boatService.getBoatById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BoatResponse> getBoatBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(boatService.getBoatBySlug(slug));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BoatResponse> createBoat(@Valid @RequestBody CreateBoatRequest request) {
        BoatResponse response = boatService.createBoat(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BoatResponse> updateBoat(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBoatRequest request) {
        return ResponseEntity.ok(boatService.updateBoat(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBoat(@PathVariable UUID id) {
        boatService.deleteBoat(id);
        return ResponseEntity.noContent().build();
    }
}
