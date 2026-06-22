package com.eventsphere.event_service.service;

import com.eventsphere.event_service.entity.Event;
import com.eventsphere.event_service.repository.EventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private static final Logger log = LoggerFactory.getLogger(EventService.class);

    @Autowired
    private EventRepository repository;

    public Event createEvent(Event event) {
        log.info("Creating event: {}", event.getTitle());
        event.setAvailableTickets(event.getTotalTickets());
        return repository.save(event);
    }

    public Event getEvent(Long id) {
        log.info("Fetching event by id: {}", id);
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public List<Event> getAllEvents() {
        log.info("Fetching all events");
        return repository.findAll();
    }

    public Event updateEvent(Long id, Event updated) {
        log.info("Updating event id: {}", id);
        Event existing = getEvent(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setLocation(updated.getLocation());
        existing.setDate(updated.getDate());
        existing.setCategory(updated.getCategory());
        // Handle ticket counts carefully (if total changes, adjust available)
        int diff = updated.getTotalTickets() - existing.getTotalTickets();
        existing.setTotalTickets(updated.getTotalTickets());
        existing.setAvailableTickets(existing.getAvailableTickets() + diff);
        return repository.save(existing);
    }

    public void deleteEvent(Long id) {
        log.info("Deleting event id: {}", id);
        repository.deleteById(id);
    }

    public Event reduceAvailableTickets(Long id, int quantity) {
        Event event = getEvent(id);
        if (event.getAvailableTickets() < quantity) {
            throw new RuntimeException("Not enough tickets available");
        }
        event.setAvailableTickets(event.getAvailableTickets() - quantity);
        return repository.save(event);
    }
}
