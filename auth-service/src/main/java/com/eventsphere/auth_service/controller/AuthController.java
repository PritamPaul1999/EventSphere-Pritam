package com.eventsphere.auth_service.controller;

import com.eventsphere.auth_service.config.JwtUtil;
import com.eventsphere.auth_service.dto.AuthRequest;
import com.eventsphere.auth_service.dto.UserDTO;
import com.eventsphere.auth_service.entity.Role;
import com.eventsphere.auth_service.entity.User;
import com.eventsphere.auth_service.repository.RoleRepository;
import com.eventsphere.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${admin.verification.code:ADMIN123}")
    private String adminVerificationCode;

    private static final Pattern PASSWORD_PATTERN = 
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$");

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered!"));
        }

        if (!PASSWORD_PATTERN.matcher(request.getPassword()).matches()) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Password must be at least 8 letters with upper, lower, number, and special character."));
        }

        Role userRole = roleRepo.findByName("USER")
                .orElseGet(() -> roleRepo.save(new Role(null, "USER")));
        User newUser = new User();
        newUser.setName(request.getName()); 
        newUser.setEmail(request.getEmail()); 
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRoles(Collections.singleton(userRole));

        userRepo.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("msg", "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password."));
        }

        User user = userRepo.findByEmail(request.getEmail()) 
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwt = jwtUtil.generateToken(user);

        return ResponseEntity.ok(Map.of("token", jwt));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        String jwt = authorizationHeader.substring(7);
        String email = jwtUtil.extractUsername(jwt);

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO userDTO = new UserDTO(
                user.getUserId(), 
                user.getName(), 
                user.getEmail(), 
                user.getRoles().stream().map(Role::getName).collect(Collectors.toList()) 
        );

        return ResponseEntity.ok(userDTO);
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> viewAllUsers() {
        List<User> users = userRepo.findAll();

        List<UserDTO> dtos = users.stream()
                .map(user -> new UserDTO(
                        user.getUserId(), 
                        user.getName(), 
                        user.getEmail(), 
                        user.getRoles().stream().map(Role::getName).collect(Collectors.toList()) 
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepo.findById(id);
        if (optionalUser.isPresent()) {
            userRepo.delete(optionalUser.get()); 
            return ResponseEntity.ok(Map.of("msg", "User deleted successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found."));
        }
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, 
                                       @RequestBody UserDTO updatedUser) {
        Optional<User> optionalUser = userRepo.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            user.setName(updatedUser.getName()); 
            user.setEmail(updatedUser.getEmail()); 

            userRepo.save(user);
            return ResponseEntity.ok(Map.of("msg", "User updated successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found."));
        }
    }
    
    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String verificationCode = body.get("code");

        if (userRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered!"));
        }

        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Password must be at least 8 characters long, include upper/lowercase, number, and special character."));
        }

        if (!adminVerificationCode.equals(verificationCode)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Invalid admin verification code."));
        }

        Role adminRole = roleRepo.findByName("ADMIN")
                .orElseGet(() -> roleRepo.save(new Role(null, "ADMIN")));

        User admin = new User();
        admin.setName(name);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRoles(Collections.singleton(adminRole));

        userRepo.save(admin);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("msg", "Admin registered successfully!"));
    }
}
