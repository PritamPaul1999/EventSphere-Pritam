package com.eventsphere.ticket_service.service;

import com.eventsphere.ticket_service.client.EventClient;
import com.eventsphere.ticket_service.client.UserClient;
import com.eventsphere.ticket_service.entity.Ticket;
import com.eventsphere.ticket_service.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

public class TicketServiceTest {

    @Mock
    private TicketRepository repository;

    @Mock
    private EventClient eventClient;

    @Mock
    private UserClient userClient;

    @InjectMocks
    private TicketService service;

    private Ticket testTicket;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testTicket = new Ticket();
        testTicket.setEventId(10L);
        testTicket.setUserId(20L);
        testTicket.setQuantity(2);
    }

    @Test
    void bookTicket_Success() {
        Mockito.when(eventClient.reduceTickets(anyLong(), anyInt())).thenReturn(new Object());
        Mockito.when(repository.save(any())).thenReturn(testTicket);

        Ticket booked = service.bookTicket(testTicket);
        assertEquals("BOOKED", booked.getStatus());
        assertNotNull(booked.getBookingTime());
    }

    @Test
    void bookTicket_EventError() {
        Mockito.when(eventClient.reduceTickets(anyLong(), anyInt())).thenReturn(null);
        assertThrows(RuntimeException.class, () -> service.bookTicket(testTicket));
    }

    @Test
    void bookTicket_Exception() {
        Mockito.when(eventClient.reduceTickets(anyLong(), anyInt())).thenThrow(new RuntimeException("API Down"));
        assertThrows(RuntimeException.class, () -> service.bookTicket(testTicket));
    }

    @Test
    void getTicketsByUser() {
        Mockito.when(repository.findByUserId(20L)).thenReturn(Collections.singletonList(testTicket));
        assertEquals(1, service.getTicketsByUser(20L).size());
    }

    @Test
    void getTicket_Found() {
        Mockito.when(repository.findById(1L)).thenReturn(Optional.of(testTicket));
        assertNotNull(service.getTicket(1L));
    }

    @Test
    void getTicket_NotFound() {
        Mockito.when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getTicket(1L));
    }
}
