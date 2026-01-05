package com.example.archivalsys.controller;

import com.example.archivalsys.dto.AuthRequest;
import com.example.archivalsys.dto.LoginRequest;
import com.example.archivalsys.dto.RegisterRequest;
import com.example.archivalsys.dto.AuthResponse;
import com.example.archivalsys.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER USING EMAIL
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.register(request.getEmail(), request.getPassword()); // updated from username to email
        return "User registered successfully";
    }

    //  LOGIN USING EMAIL
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(
                request.getEmail(),
                request.getPassword()
        );
    }
}
