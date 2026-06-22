package com.eventsphere.ticket_service;

import com.eventsphere.ticket_service.entity.Ticket;
import com.eventsphere.ticket_service.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class TicketExtrasTest {

    @Test
    void testEntity() {
        Ticket ticket = new Ticket();
        ticket.setId(1L);
        ticket.setEventId(10L);
        ticket.setUserId(20L);
        ticket.setQuantity(2);
        ticket.setBookingTime(LocalDateTime.now());
        ticket.setStatus("BOOKED");

        assertEquals(1L, ticket.getId());
        assertEquals(10L, ticket.getEventId());
        assertEquals(20L, ticket.getUserId());
        assertEquals(2, ticket.getQuantity());
        assertNotNull(ticket.getBookingTime());
        assertEquals("BOOKED", ticket.getStatus());
        
        Ticket ticket2 = new Ticket(2L, 11L, 21L, 1, LocalDateTime.now(), "CANCELLED");
        assertEquals(2L, ticket2.getId());
    }

    @Test
    void testGlobalExceptionHandler() {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        
        RuntimeException ex = new RuntimeException("err");
        var resp = handler.handleRuntime(ex);
        assertEquals("err", resp.getBody());
        
        MethodArgumentNotValidException valEx = mock(MethodArgumentNotValidException.class);
        BindingResult br = mock(BindingResult.class);
        org.mockito.Mockito.when(valEx.getBindingResult()).thenReturn(br);
        org.mockito.Mockito.when(br.getAllErrors()).thenReturn(java.util.Collections.emptyList());
        
        var resp2 = handler.handleValidationExceptions(valEx);
        assertNotNull(resp2.getBody());
    }
}
