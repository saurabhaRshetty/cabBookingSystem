package com.cabbooking.backend.service;

import com.cabbooking.backend.dto.PaymentRequest;
import com.cabbooking.backend.model.*;
import com.cabbooking.backend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final RideRepository rideRepo;
    private final PaymentRepository paymentRepo;

    // Manual constructor injection
    public PaymentService(RideRepository rideRepo, PaymentRepository paymentRepo) {
        this.rideRepo = rideRepo;
        this.paymentRepo = paymentRepo;
    }

    public Payment makePayment(String username, PaymentRequest request) {
        Ride ride = rideRepo.findById(request.getRideId()).orElseThrow();

        if (!ride.getRider().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        if (ride.getStatus() != RideStatus.COMPLETED) {
            throw new RuntimeException("Ride not completed yet");
        }

        Payment payment = new Payment();
        payment.setRide(ride);
        payment.setMethod(request.getMethod());
        payment.setStatus(PaymentStatus.PENDING);

        if (request.getMethod() == PaymentMethod.CASH) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setTransactionId("CASH_" + System.currentTimeMillis());
        } else {
            // MOCK or real Razorpay/Stripe payment below:
            payment.setTransactionId("TRX_" + System.currentTimeMillis());
            payment.setStatus(PaymentStatus.COMPLETED); // assume success for now
        }

        Payment savedPayment = paymentRepo.save(payment);

        // Mark ride as paid and update
        ride.setFarePaid(true);
        rideRepo.save(ride);

        return savedPayment;
    }
}