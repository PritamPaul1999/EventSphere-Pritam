package com.eventsphere.ticket_service.controller;

import com.eventsphere.ticket_service.entity.Ticket;
import com.eventsphere.ticket_service.service.TicketService;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TicketService service;

    @Autowired
    private ObjectMapper objectMapper;

    private Ticket testTicket;

    @BeforeEach
    void setUp() {
        testTicket = new Ticket(1L, 10L, 20L, 2, LocalDateTime.now(), "BOOKED");
    }

    @Test
    void bookTicket_Success() throws Exception {
        Mockito.when(service.bookTicket(any())).thenReturn(testTicket);

        mockMvc.perform(post("/api/tickets/book")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTicket)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("BOOKED"));
    }

    @Test
    void getTicketsByUser_Success() throws Exception {
        Mockito.when(service.getTicketsByUser(anyLong())).thenReturn(List.of(testTicket));

        mockMvc.perform(get("/api/tickets/user/20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(20));
    }

    @Test
    void getTicketById_Success() throws Exception {
        Mockito.when(service.getTicket(anyLong())).thenReturn(testTicket);

        mockMvc.perform(get("/api/tickets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }
}
