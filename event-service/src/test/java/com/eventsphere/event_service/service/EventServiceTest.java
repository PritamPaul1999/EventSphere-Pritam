package com.eventsphere.event_service.service;

import com.eventsphere.event_service.entity.Event;
import com.eventsphere.event_service.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

public class EventServiceTest {

    @Mock
    private EventRepository repository;

    @InjectMocks
    private EventService service;

    private Event testEvent;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testEvent = new Event(1L, "Concert", "Music", "NYC", LocalDate.now(), 100, 100, "General");
    }

    @Test
    void createEvent() {
        Mockito.when(repository.save(any())).thenReturn(testEvent);
        Event created = service.createEvent(testEvent);
        assertEquals("Concert", created.getTitle());
    }

    @Test
    void getEvent_Found() {
        Mockito.when(repository.findById(1L)).thenReturn(Optional.of(testEvent));
        Event found = service.getEvent(1L);
        assertNotNull(found);
    }

    @Test
    void getEvent_NotFound() {
        Mockito.when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getEvent(1L));
    }

    @Test
    void getAllEvents() {
        Mockito.when(repository.findAll()).thenReturn(List.of(testEvent));
        List<Event> events = service.getAllEvents();
        assertEquals(1, events.size());
    }

    @Test
    void updateEvent_Success() {
        Mockito.when(repository.findById(1L)).thenReturn(Optional.of(testEvent));
        Mockito.when(repository.save(any())).thenReturn(testEvent);
        
        Event updateData = new Event();
        updateData.setTitle("New Title");
        
        Event updated = service.updateEvent(1L, updateData);
        assertEquals("New Title", updated.getTitle());
    }

    @Test
    void deleteEvent() {
        service.deleteEvent(1L);
        Mockito.verify(repository).deleteById(1L);
    }

    @Test
    void reduceTickets_Success() {
        Mockito.when(repository.findById(1L)).thenReturn(Optional.of(testEvent));
        Mockito.when(repository.save(any())).thenReturn(testEvent);
        
        Event result = service.reduceAvailableTickets(1L, 10);
        assertEquals(90, result.getAvailableTickets());
    }

    @Test
    void reduceTickets_Insufficient() {
        testEvent.setAvailableTickets(5);
        Mockito.when(repository.findById(1L)).thenReturn(Optional.of(testEvent));
        
        assertThrows(RuntimeException.class, () -> service.reduceAvailableTickets(1L, 10));
    }
}
