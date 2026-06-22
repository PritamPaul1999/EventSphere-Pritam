package com.eventsphere.ticket_service.controller;

import com.eventsphere.ticket_service.entity.Ticket;
import com.eventsphere.ticket_service.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService service;

    @PostMapping("/book")
    public Ticket bookTicket(@Valid @RequestBody Ticket ticket) {
        return service.bookTicket(ticket);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return service.getAllTickets();
    }

    @GetMapping("/user/{userId}")
    public List<Ticket> getTicketsByUser(@PathVariable Long userId) {
        return service.getTicketsByUser(userId);
    }
    
    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return service.getTicket(id);
    }
}
