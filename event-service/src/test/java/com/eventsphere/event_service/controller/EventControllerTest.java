package com.eventsphere.event_service.controller;

import com.eventsphere.event_service.entity.Event;
import com.eventsphere.event_service.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService service;

    @Autowired
    private ObjectMapper objectMapper;

    private Event testEvent;

    @BeforeEach
    void setUp() {
        testEvent = new Event(1L, "Concert", "Music", "NYC", LocalDate.now(), 100, 100, "General");
    }

    @Test
    void createEvent_Success() throws Exception {
        Mockito.when(service.createEvent(any())).thenReturn(testEvent);

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Concert"));
    }

    @Test
    void getEvent_Success() throws Exception {
        Mockito.when(service.getEvent(1L)).thenReturn(testEvent);

        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Concert"));
    }

    @Test
    void getAllEvents_Success() throws Exception {
        Mockito.when(service.getAllEvents()).thenReturn(List.of(testEvent));

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Concert"));
    }

    @Test
    void updateEvent_Success() throws Exception {
        Mockito.when(service.updateEvent(anyLong(), any())).thenReturn(testEvent);

        mockMvc.perform(put("/api/events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteEvent_Success() throws Exception {
        mockMvc.perform(delete("/api/events/1"))
                .andExpect(status().isOk());
        Mockito.verify(service).deleteEvent(1L);
    }

    @Test
    void reduceTickets_Success() throws Exception {
        Mockito.when(service.reduceAvailableTickets(anyLong(), anyInt())).thenReturn(testEvent);

        mockMvc.perform(post("/api/events/1/reduce-tickets")
                .param("quantity", "5"))
                .andExpect(status().isOk());
    }
}
