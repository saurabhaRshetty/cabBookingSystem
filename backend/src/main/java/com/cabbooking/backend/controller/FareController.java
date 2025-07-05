package com.cabbooking.backend.controller;

import com.cabbooking.backend.service.FareService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/fare")
public class FareController {

    private final FareService fareService;

    public FareController(FareService fareService) {
        this.fareService = fareService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateFare(@RequestBody Map<String, String> request) {
        String pickup = request.get("pickup");
        String drop = request.get("drop");

        // Validate input parameters
        if (pickup == null || pickup.isBlank() || drop == null || drop.isBlank()) {
            return ResponseEntity.badRequest().body("Both pickup and drop locations are required");
        }

        try {
            Map<String, Object> result = fareService.calculateFare(pickup, drop);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculating fare: " + e.getMessage());
        }
    }
}