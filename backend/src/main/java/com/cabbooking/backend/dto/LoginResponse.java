package com.cabbooking.backend.dto;

public class LoginResponse {
    private String token;
    private String role;

    // All-args constructor
    public LoginResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}