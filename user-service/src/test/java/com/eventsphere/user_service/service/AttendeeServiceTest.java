package com.eventsphere.user_service.service;

import com.eventsphere.user_service.entity.Attendee;
import com.eventsphere.user_service.repository.AttendeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AttendeeServiceTest {

    @Mock
    private AttendeeRepository repository;

    @InjectMocks
    private AttendeeService service;

    private Attendee attendee;

    @BeforeEach
    void setUp() {
        attendee = new Attendee(1L, "John Doe", "john@example.com", "1234567890");
    }

    @Test
    void testCreateAttendee() {
        when(repository.save(any(Attendee.class))).thenReturn(attendee);
        Attendee created = service.createAttendee(attendee);
        assertNotNull(created);
        assertEquals("John Doe", created.getName());
        verify(repository, Mockito.times(1)).save(attendee);
    }

    @Test
    void testGetAttendee_Found() {
        when(repository.findById(1L)).thenReturn(Optional.of(attendee));
        Attendee found = service.getAttendee(1L);
        assertEquals(attendee.getEmail(), found.getEmail());
    }

    @Test
    void testGetAttendee_NotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getAttendee(1L));
    }

    @Test
    void testGetAllAttendees() {
        when(repository.findAll()).thenReturn(Arrays.asList(attendee));
        List<Attendee> list = service.getAllAttendees();
        assertEquals(1, list.size());
    }

    @Test
    void testUpdateAttendee() {
        Attendee updated = new Attendee(1L, "Jane", "jane@example.com", "0987");
        when(repository.findById(1L)).thenReturn(Optional.of(attendee));
        when(repository.save(any(Attendee.class))).thenReturn(updated);

        Attendee result = service.updateAttendee(1L, updated);
        assertEquals("Jane", result.getName());
        assertEquals("jane@example.com", result.getEmail());
    }

    @Test
    void testDeleteAttendee() {
        service.deleteAttendee(1L);
        verify(repository, Mockito.times(1)).deleteById(1L);
    }
}
