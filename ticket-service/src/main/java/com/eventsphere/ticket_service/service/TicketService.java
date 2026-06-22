package com.eventsphere.ticket_service.service;

import com.eventsphere.ticket_service.client.EventClient;
import com.eventsphere.ticket_service.client.UserClient;
import com.eventsphere.ticket_service.entity.Ticket;
import com.eventsphere.ticket_service.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketService.class);

    @Autowired
    private TicketRepository repository;

    @Autowired
    private EventClient eventClient;

    @Autowired
    private UserClient userClient;

    public Ticket bookTicket(Ticket ticket) {
        log.info("Process booking for event: {}, user: {}", ticket.getEventId(), ticket.getUserId());
        
        try {
            // Verify event exists and reduce available tickets
            Object event = eventClient.reduceTickets(ticket.getEventId(), ticket.getQuantity());
            if (event == null) {
                throw new RuntimeException("Event not found or ticket reduction failed");
            }
            
            ticket.setBookingTime(LocalDateTime.now());
            ticket.setStatus("BOOKED");
            return repository.saveAndFlush(ticket);
        } catch (Exception e) {
            log.error("Error booking ticket: " + e.getMessage());
            throw new RuntimeException("Booking failed: " + e.getMessage());
        }
    }

    public List<Ticket> getAllTickets() {
        return repository.findAll();
    }

    public List<Ticket> getTicketsByUser(Long userId) {
        log.info("Fetching tickets for user ID: {}", userId);
        List<Ticket> tickets = repository.findByUserId(userId);
        log.info("Found {} tickets for user ID: {}", tickets.size(), userId);
        return tickets;
    }
    
    public Ticket getTicket(Long ticketId) {
        return repository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
}
