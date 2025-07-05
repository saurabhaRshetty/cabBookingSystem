package com.cabbooking.backend.controller;

import com.cabbooking.backend.dto.PaymentRequest;
import com.cabbooking.backend.model.Payment;
import com.cabbooking.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    // Explicit constructor for dependency injection
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/pay")
    public ResponseEntity<Payment> makePayment(@RequestBody PaymentRequest request, Principal principal) {
        return ResponseEntity.ok(paymentService.makePayment(principal.getName(), request));
    }
}