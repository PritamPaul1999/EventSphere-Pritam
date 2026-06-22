package com.eventsphere.user_service.controller;

import com.eventsphere.user_service.entity.Attendee;
import com.eventsphere.user_service.service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class AttendeeController {

    @Autowired
    private AttendeeService service;

    @PostMapping
    public Attendee createAttendee(@Valid @RequestBody Attendee attendee) {
        return service.createAttendee(attendee);
    }

    @GetMapping("/{id}")
    public Attendee getAttendee(@PathVariable Long id) {
        return service.getAttendee(id);
    }

    @GetMapping
    public List<Attendee> getAllAttendees() {
        return service.getAllAttendees();
    }

    @PutMapping("/{id}")
    public Attendee updateAttendee(@PathVariable Long id, @Valid @RequestBody Attendee attendee) {
        return service.updateAttendee(id, attendee);
    }

    @DeleteMapping("/{id}")
    public void deleteAttendee(@PathVariable Long id) {
        service.deleteAttendee(id);
    }
}
