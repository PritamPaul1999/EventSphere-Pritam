package com.eventsphere.user_service.service;

import com.eventsphere.user_service.entity.Attendee;
import com.eventsphere.user_service.repository.AttendeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendeeService {

    private static final Logger log = LoggerFactory.getLogger(AttendeeService.class);

    @Autowired
    private AttendeeRepository repository;

    public Attendee createAttendee(Attendee attendee) {
        log.info("Creating attendee: {}", attendee.getEmail());
        return repository.save(attendee);
    }

    public Attendee getAttendee(Long id) {
        log.info("Fetching attendee by id: {}", id);
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Attendee not found"));
    }

    public List<Attendee> getAllAttendees() {
        log.info("Fetching all attendees");
        return repository.findAll();
    }

    public Attendee updateAttendee(Long id, Attendee updated) {
        log.info("Updating attendee id: {}", id);
        Attendee existing = getAttendee(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhoneNumber(updated.getPhoneNumber());
        return repository.save(existing);
    }

    public void deleteAttendee(Long id) {
        log.info("Deleting attendee id: {}", id);
        repository.deleteById(id);
    }
}
