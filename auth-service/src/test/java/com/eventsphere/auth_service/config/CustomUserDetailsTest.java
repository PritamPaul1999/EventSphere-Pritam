package com.eventsphere.auth_service.config;

import com.eventsphere.auth_service.entity.Role;
import com.eventsphere.auth_service.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class CustomUserDetailsTest {

    @Test
    void testMethods() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("pass");
        user.setRoles(Collections.singleton(new Role(1L, "USER")));

        CustomUserDetails details = new CustomUserDetails(user);

        assertEquals("test@example.com", details.getUsername());
        assertEquals("pass", details.getPassword());
        assertTrue(details.isAccountNonExpired());
        assertTrue(details.isAccountNonLocked());
        assertTrue(details.isCredentialsNonExpired());
        assertTrue(details.isEnabled());
        
        Collection<? extends GrantedAuthority> authorities = details.getAuthorities();
        assertEquals(1, authorities.size());
        assertEquals("ROLE_USER", authorities.iterator().next().getAuthority());
    }
}
