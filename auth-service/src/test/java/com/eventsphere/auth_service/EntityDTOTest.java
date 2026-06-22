package com.eventsphere.auth_service;

import com.eventsphere.auth_service.dto.AuthRequest;
import com.eventsphere.auth_service.dto.UserDTO;
import com.eventsphere.auth_service.entity.Role;
import com.eventsphere.auth_service.entity.User;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class EntityDTOTest {

    @Test
    void testAuthRequest() {
        AuthRequest req = new AuthRequest();
        req.setName("name");
        req.setEmail("email");
        req.setPassword("pass");
        
        assertEquals("name", req.getName());
        assertEquals("email", req.getEmail());
        assertEquals("pass", req.getPassword());
        
        AuthRequest req2 = new AuthRequest("n", "e", "p");
        assertEquals("n", req2.getName());
    }

    @Test
    void testUserDTO() {
        UserDTO dto = new UserDTO();
        dto.setId(1L);
        dto.setName("n");
        dto.setEmail("e");
        dto.setRoles(List.of("R"));
        
        assertEquals(1L, dto.getId());
        assertEquals("n", dto.getName());
        assertEquals("e", dto.getEmail());
        assertEquals("R", dto.getRoles().get(0));
        
        UserDTO dto2 = new UserDTO(2L, "n2", "e2", List.of("R2"));
        assertEquals(2L, dto2.getId());
    }

    @Test
    void testUserAndRole() {
        Role role = new Role();
        role.setId(1L);
        role.setName("USER");
        assertEquals(1L, role.getId());
        assertEquals("USER", role.getName());
        
        Role role2 = new Role(2L, "ADMIN");
        assertEquals("ADMIN", role2.getName());

        User user = new User();
        user.setUserId(1L);
        user.setName("n");
        user.setEmail("e");
        user.setPassword("p");
        user.setRoles(Collections.singleton(role));
        
        assertEquals(1L, user.getUserId());
        assertEquals("n", user.getName());
        assertEquals("e", user.getEmail());
        assertEquals("p", user.getPassword());
        assertEquals(1, user.getRoles().size());
        
        User user2 = new User(2L, "n2", "e2", "p2", Collections.emptySet());
        assertEquals(2L, user2.getUserId());
    }
}
