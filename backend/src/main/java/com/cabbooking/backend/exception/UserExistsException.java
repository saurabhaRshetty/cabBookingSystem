package com.cabbooking.backend.exception;

public class UserExistsException extends Exception {
    public UserExistsException(String message) {
        super(message);
    }
}