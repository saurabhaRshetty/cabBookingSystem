package com.cabbooking.backend.controller;

import com.cabbooking.backend.dto.BookRideRequest;
import com.cabbooking.backend.model.Ride;
import com.cabbooking.backend.service.RideService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    // Manual constructor injection
    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping("/book")
    public ResponseEntity<Ride> bookRide(@RequestBody BookRideRequest request, Principal principal) {
        return ResponseEntity.ok(rideService.bookRide(principal.getName(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ride>> myRides(Principal principal) {
        return ResponseEntity.ok(rideService.getRidesByRider(principal.getName()));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Ride>> availableRides() {
        return ResponseEntity.ok(rideService.getAvailableRides());
    }

    @PostMapping("/accept/{rideId}")
    public ResponseEntity<Ride> acceptRide(@PathVariable Long rideId, Principal principal) {
        return ResponseEntity.ok(rideService.acceptRide(principal.getName(), rideId));
    }

    @PostMapping("/complete/{rideId}")
    public ResponseEntity<Ride> completeRide(@PathVariable Long rideId, Principal principal) {
        return ResponseEntity.ok(rideService.completeRide(principal.getName(), rideId));
    }

    @GetMapping("/driver")
    public ResponseEntity<List<Ride>> getDriverRides(Principal principal) {
        return ResponseEntity.ok(rideService.getRidesByDriver(principal.getName()));
    }
}