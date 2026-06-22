package com.eventsphere.auth_service.config;

import com.eventsphere.auth_service.entity.Role;
import com.eventsphere.auth_service.entity.User;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setRoles(Collections.singleton(new Role(1L, "USER")));
    }

    @Test
    void testGenerateAndExtract() {
        String token = jwtUtil.generateToken(testUser);
        assertNotNull(token);
        
        String username = jwtUtil.extractUsername(token);
        assertEquals("test@example.com", username);
    }

    @Test
    void testExtractClaim() {
        String token = jwtUtil.generateToken(testUser);
        Object roles = jwtUtil.extractClaim(token, claims -> claims.get("roles"));
        assertNotNull(roles);
    }
}
