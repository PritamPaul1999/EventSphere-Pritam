package com.eventsphere.auth_service.controller;

import com.eventsphere.auth_service.config.JwtUtil;
import com.eventsphere.auth_service.dto.AuthRequest;
import com.eventsphere.auth_service.dto.UserDTO;
import com.eventsphere.auth_service.entity.Role;
import com.eventsphere.auth_service.entity.User;
import com.eventsphere.auth_service.repository.RoleRepository;
import com.eventsphere.auth_service.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "admin.verification.code=ADMIN123")
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authManager;

    @MockBean
    private UserRepository userRepo;

    @MockBean
    private RoleRepository roleRepo;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthController authController;

    private User testUser;
    private Role userRole;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authController, "adminVerificationCode", "ADMIN123");

        userRole = new Role(1L, "USER");
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("EncodedPassword123!");
        testUser.setRoles(Collections.singleton(userRole));
    }

    @Test
    void register_Success() throws Exception {
        AuthRequest request = new AuthRequest("Test User", "test@example.com", "Password123!");
        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());
        Mockito.when(roleRepo.findByName("USER")).thenReturn(Optional.of(userRole));
        Mockito.when(passwordEncoder.encode(anyString())).thenReturn("encoded");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void register_EmailExists() throws Exception {
        AuthRequest request = new AuthRequest("Test User", "test@example.com", "Password123!");
        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_Success() throws Exception {
        AuthRequest request = new AuthRequest(null, "test@example.com", "Password123!");
        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        Mockito.when(jwtUtil.generateToken(any())).thenReturn("token");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void login_InvalidCredentials() throws Exception {
        AuthRequest request = new AuthRequest(null, "test@example.com", "pass");
        Mockito.when(authManager.authenticate(any())).thenThrow(new BadCredentialsException("err"));

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProfile_Success() throws Exception {
        Mockito.when(jwtUtil.extractUsername(anyString())).thenReturn("test@example.com");
        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        mockMvc.perform(get("/auth/profile")
                .header("Authorization", "Bearer token"))
                .andExpect(status().isOk());
    }

    @Test
    void getProfile_Unauthorized() throws Exception {
        mockMvc.perform(get("/auth/profile"))
                .andExpect(status().isUnauthorized());
        
        mockMvc.perform(get("/auth/profile")
                .header("Authorization", "WrongHeader"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProfile_UserNotFound() throws Exception {
        Mockito.when(jwtUtil.extractUsername(anyString())).thenReturn("ghost");
        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(get("/auth/profile")
                .header("Authorization", "Bearer token"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("User not found"));
    }

    @Test
    void viewAllUsers_Success() throws Exception {
        Mockito.when(userRepo.findAll()).thenReturn(List.of(testUser));
        mockMvc.perform(get("/auth/users")).andExpect(status().isOk());
    }

    @Test
    void deleteUser_Success() throws Exception {
        Mockito.when(userRepo.findById(anyLong())).thenReturn(Optional.of(testUser));
        mockMvc.perform(delete("/auth/users/1")).andExpect(status().isOk());
    }

    @Test
    void deleteUser_NotFound() throws Exception {
        Mockito.when(userRepo.findById(anyLong())).thenReturn(Optional.empty());
        mockMvc.perform(delete("/auth/users/99")).andExpect(status().isNotFound());
    }

    @Test
    void updateUser_Success() throws Exception {
        UserDTO dto = new UserDTO(1L, "n", "e", List.of("U"));
        Mockito.when(userRepo.findById(anyLong())).thenReturn(Optional.of(testUser));
        mockMvc.perform(put("/auth/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void updateUser_NotFound() throws Exception {
        UserDTO dto = new UserDTO(1L, "n", "e", List.of("U"));
        Mockito.when(userRepo.findById(anyLong())).thenReturn(Optional.empty());
        mockMvc.perform(put("/auth/users/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void registerAdmin_Success() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("name", "Admin");
        body.put("email", "admin@example.com");
        body.put("password", "AdminPassword123!");
        body.put("code", "ADMIN123");

        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());
        Mockito.when(roleRepo.findByName("ADMIN")).thenReturn(Optional.of(new Role(2L, "ADMIN")));
        Mockito.when(passwordEncoder.encode(anyString())).thenReturn("encoded");

        mockMvc.perform(post("/auth/register-admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated());
    }

    @Test
    void registerAdmin_InvalidCode() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("name", "Admin");
        body.put("email", "admin2@example.com");
        body.put("password", "AdminPassword123!");
        body.put("code", "WRONG");
        
        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/register-admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isForbidden());
    }

    @Test
    void registerAdmin_EmailExists() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("email", "test@example.com");
        body.put("code", "ADMIN123");
        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        mockMvc.perform(post("/auth/register-admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registerAdmin_PasswordInvalid() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("email", "admin2@example.com");
        body.put("password", "short");
        body.put("code", "ADMIN123");
        Mockito.when(userRepo.findByEmail(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/register-admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }
}
