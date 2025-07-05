package com.cabbooking.backend.model;

import jakarta.persistence.*;

@Entity
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pickupLocation;
    private String dropLocation;

    @Enumerated(EnumType.STRING)
    private RideStatus status;

    @ManyToOne
    private users rider;  // Note: Class name 'users' is unconventional. Should be 'User'

    @ManyToOne
    private users driver; // Note: Class name 'users' is unconventional. Should be 'User'

    private Double fare;
    private Double distanceInKm;
    private boolean farePaid = false;

    // No-args constructor
    public Ride() {
    }

    // All-args constructor
    public Ride(Long id, String pickupLocation, String dropLocation,
                RideStatus status, users rider, users driver,
                Double fare, Double distanceInKm, boolean farePaid) {
        this.id = id;
        this.pickupLocation = pickupLocation;
        this.dropLocation = dropLocation;
        this.status = status;
        this.rider = rider;
        this.driver = driver;
        this.fare = fare;
        this.distanceInKm = distanceInKm;
        this.farePaid = farePaid;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDropLocation() {
        return dropLocation;
    }

    public void setDropLocation(String dropLocation) {
        this.dropLocation = dropLocation;
    }

    public RideStatus getStatus() {
        return status;
    }

    public void setStatus(RideStatus status) {
        this.status = status;
    }

    public users getRider() {
        return rider;
    }

    public void setRider(users rider) {
        this.rider = rider;
    }

    public users getDriver() {
        return driver;
    }

    public void setDriver(users driver) {
        this.driver = driver;
    }

    public Double getFare() {
        return fare;
    }

    public void setFare(Double fare) {
        this.fare = fare;
    }

    public Double getDistanceInKm() {
        return distanceInKm;
    }

    public void setDistanceInKm(Double distanceInKm) {
        this.distanceInKm = distanceInKm;
    }

    public boolean isFarePaid() {
        return farePaid;
    }

    public void setFarePaid(boolean farePaid) {
        this.farePaid = farePaid;
    }
}