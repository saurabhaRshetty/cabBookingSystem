package com.cabbooking.backend.controller;

import com.cabbooking.backend.dto.RegisterRequest;
import com.cabbooking.backend.dto.LoginRequest;
import com.cabbooking.backend.dto.LoginResponse;
import com.cabbooking.backend.exception.UserExistsException;
import com.cabbooking.backend.service.AuthService;
import com.cabbooking.backend.model.users;
import com.cabbooking.backend.model.Role;
import com.cabbooking.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepo;

    public AuthController(AuthService authService, UserRepository userRepo) {
        this.authService = authService;
        this.userRepo = userRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Basic validation
            if (request.getUsername() == null || request.getUsername().isBlank()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            if (request.getRole() == null) {
                return ResponseEntity.badRequest().body("Role is required");
            }

            return ResponseEntity.ok(authService.register(request));
        } catch (UserExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/admin/pending-drivers")
    public ResponseEntity<List<users>> getPendingDrivers() {
        return ResponseEntity.ok(userRepo.findByRoleAndApprovedFalse(Role.DRIVER));
    }

    @PostMapping("/admin/approve-driver/{id}")
    public ResponseEntity<String> approveDriver(@PathVariable Long id) {
        users user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        user.setApproved(true);
        userRepo.save(user);
        return ResponseEntity.ok("Driver approved");
    }
}