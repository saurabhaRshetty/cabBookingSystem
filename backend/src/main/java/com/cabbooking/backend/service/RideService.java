package com.cabbooking.backend.service;

import com.cabbooking.backend.dto.BookRideRequest;
import com.cabbooking.backend.model.*;
import com.cabbooking.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideService {

    private final RideRepository rideRepo;
    private final UserRepository userRepo;

    // Explicit constructor for dependency injection
    public RideService(RideRepository rideRepo, UserRepository userRepo) {
        this.rideRepo = rideRepo;
        this.userRepo = userRepo;
    }

    public Ride bookRide(String username, BookRideRequest request) {
        users rider = userRepo.findByUsername(username).orElseThrow();

        Ride ride = new Ride();
        ride.setPickupLocation(request.getPickupLocation());
        ride.setDropLocation(request.getDropLocation());
        ride.setRider(rider);
        ride.setStatus(RideStatus.REQUESTED);
        ride.setFare(calculateFare(request.getPickupLocation(), request.getDropLocation()));

        return rideRepo.save(ride);
    }

    public List<Ride> getAvailableRides() {
        return rideRepo.findByStatusAndDriverIsNull(RideStatus.REQUESTED);
    }

    public Ride acceptRide(String driverUsername, Long rideId) {
        Ride ride = rideRepo.findById(rideId).orElseThrow();
        users driver = userRepo.findByUsername(driverUsername).orElseThrow();

        if (ride.getStatus() != RideStatus.REQUESTED || ride.getDriver() != null) {
            throw new RuntimeException("Ride already assigned or invalid");
        }

        ride.setDriver(driver);
        ride.setStatus(RideStatus.ACCEPTED);
        return rideRepo.save(ride);
    }

    public Ride completeRide(String driverUsername, Long rideId) {
        Ride ride = rideRepo.findById(rideId).orElseThrow();

        if (!ride.getDriver().getUsername().equals(driverUsername)) {
            throw new RuntimeException("Unauthorized ride completion");
        }

        if (ride.getStatus() != RideStatus.ACCEPTED) {
            throw new RuntimeException("Ride not in accepted state");
        }

        // Optional: calculate distance (mocked here)
        double distance = Math.random() * 10 + 1; // 1 to 10 km
        ride.setDistanceInKm(distance);

        double fare = calculateFare(distance);
        ride.setFare(fare);

        ride.setStatus(RideStatus.COMPLETED);
        return rideRepo.save(ride);
    }

    private double calculateFare(double distanceKm) {
        double baseFare = 50.0;
        double perKmRate = 20.0;
        return baseFare + (perKmRate * distanceKm);
    }

    public List<Ride> getRidesByRider(String username) {
        return rideRepo.findByRiderUsername(username);
    }

    private double calculateFare(String pickup, String drop) {
        // For now: flat fare
        return 150.0;
    }

    public List<Ride> getRidesByDriver(String driverUsername) {
        return rideRepo.findByDriverUsername(driverUsername);
    }
}