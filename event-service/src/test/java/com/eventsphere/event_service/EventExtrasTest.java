package com.eventsphere.event_service;

import com.eventsphere.event_service.entity.Event;
import com.eventsphere.event_service.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class EventExtrasTest {

    @Test
    void testEntity() {
        Event event = new Event();
        event.setId(1L);
        event.setTitle("T");
        event.setDescription("D");
        event.setLocation("L");
        event.setDate(LocalDate.now());
        event.setTotalTickets(100);
        event.setAvailableTickets(50);

        assertEquals(1L, event.getId());
        assertEquals("T", event.getTitle());
        assertEquals("D", event.getDescription());
        assertEquals("L", event.getLocation());
        assertNotNull(event.getDate());
        assertEquals(100, event.getTotalTickets());
        assertEquals(50, event.getAvailableTickets());
        
        Event event2 = new Event(2L, "T2", "D2", "L2", LocalDate.now(), 200, 200, "General");
        assertEquals(2L, event2.getId());
    }

    @Test
    void testGlobalExceptionHandler() {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        
        RuntimeException ex = new RuntimeException("err");
        var resp = handler.handleRuntime(ex);
        assertEquals("err", resp.getBody());
        
        // Testing validation handler with a mock
        MethodArgumentNotValidException valEx = mock(MethodArgumentNotValidException.class);
        BindingResult br = mock(BindingResult.class);
        org.mockito.Mockito.when(valEx.getBindingResult()).thenReturn(br);
        org.mockito.Mockito.when(br.getAllErrors()).thenReturn(java.util.Collections.emptyList());
        
        var resp2 = handler.handleValidationExceptions(valEx);
        assertNotNull(resp2.getBody());
    }
}
