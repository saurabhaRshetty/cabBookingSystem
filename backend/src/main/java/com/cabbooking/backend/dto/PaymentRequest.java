package com.cabbooking.backend.dto;

import com.cabbooking.backend.model.PaymentMethod;

public class PaymentRequest {
    private Long rideId;
    private PaymentMethod method;

    // Getters and Setters

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }
}
