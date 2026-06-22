package com.eventsphere.event_service.controller;

import com.eventsphere.event_service.entity.Event;
import com.eventsphere.event_service.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService service;

    @PostMapping
    public Event createEvent(@Valid @RequestBody Event event) {
        return service.createEvent(event);
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        return service.getEvent(id);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return service.getAllEvents();
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @Valid @RequestBody Event event) {
        return service.updateEvent(id, event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        service.deleteEvent(id);
    }

    @PostMapping("/{id}/reduce-tickets")
    public Event reduceTickets(@PathVariable Long id, @RequestParam int quantity) {
        return service.reduceAvailableTickets(id, quantity);
    }
}
