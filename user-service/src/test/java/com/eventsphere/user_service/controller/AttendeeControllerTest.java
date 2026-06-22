package com.eventsphere.user_service.controller;

import com.eventsphere.user_service.entity.Attendee;
import com.eventsphere.user_service.service.AttendeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(AttendeeController.class)
public class AttendeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AttendeeService service;

    @Autowired
    private ObjectMapper objectMapper;

    private Attendee attendee;

    @BeforeEach
    void setUp() {
        attendee = new Attendee(1L, "John Doe", "john@example.com", "1234");
    }

    @Test
    void testCreateAttendee() throws Exception {
        Mockito.when(service.createAttendee(any(Attendee.class))).thenReturn(attendee);

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(attendee)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void testGetAttendee() throws Exception {
        Mockito.when(service.getAttendee(1L)).thenReturn(attendee);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john@example.com"));
    }

    @Test
    void testGetAllAttendees() throws Exception {
        Mockito.when(service.getAllAttendees()).thenReturn(Arrays.asList(attendee));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    void testUpdateAttendee() throws Exception {
        Mockito.when(service.updateAttendee(eq(1L), any(Attendee.class))).thenReturn(attendee);

        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(attendee)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void testDeleteAttendee() throws Exception {
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk());
        Mockito.verify(service, Mockito.times(1)).deleteAttendee(1L);
    }
}
