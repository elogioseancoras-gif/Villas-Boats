package com.villasboats.application.service;

import com.villasboats.domain.entity.User;
import com.villasboats.domain.valueobject.Language;
import com.villasboats.domain.valueobject.UserRole;
import com.villasboats.domain.repository.UserRepository;
import com.villasboats.infrastructure.security.JwtUtils;
import com.villasboats.infrastructure.web.dto.request.LoginRequest;
import com.villasboats.infrastructure.web.dto.request.RegisterRequest;
import com.villasboats.infrastructure.web.dto.response.AuthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpirationMs;

    public AuthService(UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      AuthenticationManager authenticationManager,
                      JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildAuthResponse(jwt, user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhoneNumber())
                .preferredLanguage(request.getPreferredLanguage() != null ?
                    Language.fromCode(request.getPreferredLanguage()) : Language.EN)
                .role(UserRole.CUSTOMER)
                .isActive(true)
                .isEmailVerified(false)
                .build();

        user = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String jwt = jwtUtils.generateJwtToken(authentication);

        return buildAuthResponse(jwt, user);
    }

    private AuthResponse buildAuthResponse(String jwt, User user) {
        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .expiresIn(jwtExpirationMs / 1000) // Convert to seconds
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .loginAt(LocalDateTime.now())
                .build();
    }
}
