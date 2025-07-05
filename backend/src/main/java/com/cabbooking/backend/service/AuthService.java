package com.cabbooking.backend.service;

import com.cabbooking.backend.dto.RegisterRequest;
import com.cabbooking.backend.dto.LoginRequest;
import com.cabbooking.backend.dto.LoginResponse;
import com.cabbooking.backend.exception.UserExistsException;
import com.cabbooking.backend.model.Role;
import com.cabbooking.backend.model.users;
import com.cabbooking.backend.repository.UserRepository;
import com.cabbooking.backend.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    // Manual constructor injection
    public AuthService(JwtUtil jwtUtil, UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) throws UserExistsException {
        logger.info("Registration attempt for: {}", request.getUsername());

        // Input validation
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (request.getRole() == null) {
            throw new IllegalArgumentException("Role is required");
        }

        // Validate email format
        if (!isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Password complexity
        if (!isPasswordValid(request.getPassword())) {
            throw new IllegalArgumentException(
                    "Password must be at least 6 characters with 1 uppercase letter and 1 digit"
            );
        }

        // Check for duplicates
        if (userRepo.existsByUsername(request.getUsername())) {
            logger.warn("Username already exists: {}", request.getUsername());
            throw new UserExistsException("Username already exists");
        }

        if (userRepo.existsByEmail(request.getEmail())) {
            logger.warn("Email already exists: {}", request.getEmail());
            throw new UserExistsException("Email already exists");
        }

        // Create user object
        users user = new users();
        user.setUsername(request.getUsername().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setRole(request.getRole());

        // Set approval status
        if (request.getRole() == Role.DRIVER) {
            user.setApproved(true); // ✅ Auto-approve for development/testing
            logger.info("Registering driver {} (auto-approved for dev)", user.getUsername());
        } else {
            user.setApproved(true);
            logger.info("Registering rider: {}", user.getUsername());
        }


        userRepo.save(user);
        logger.info("User registered successfully: {}", user.getUsername());
        return "User registered successfully!";
    }

    public LoginResponse login(LoginRequest request) {
        logger.info("Login attempt for: {}", request.getUsername());

        users user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> {
                    logger.error("User not found: {}", request.getUsername());
                    return new RuntimeException("User not found");
                });

        logger.debug("Found user: {} | Role: {} | Approved: {}",
                user.getUsername(), user.getRole(), user.isApproved());

        if (user.getRole() == Role.DRIVER && !user.isApproved()) {
            logger.warn("Driver not approved: {}", user.getUsername());
            throw new RuntimeException("Driver account pending approval");
        }

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            logger.error("Password mismatch for: {}", user.getUsername());
            throw new RuntimeException("Invalid credentials");
        }

        String jwtToken = jwtUtil.generateToken(user.getUsername());
        logger.info("Login successful for: {}", user.getUsername());

        return new LoginResponse(jwtToken, user.getRole().name());
    }

    private boolean isValidEmail(String email) {
        String regex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        return email.matches(regex);
    }

    private boolean isPasswordValid(String password) {
        // At least 6 characters, 1 uppercase, 1 digit
        return password.length() >= 6 &&
                password.matches(".*[A-Z].*") &&
                password.matches(".*\\d.*");
    }
}