package com.eventsphere.ticket_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "event-service", path = "/api/events")
public interface EventClient {

    @GetMapping("/{id}")
    Object getEvent(@PathVariable("id") Long id);

    @PostMapping("/{id}/reduce-tickets")
    Object reduceTickets(@PathVariable("id") Long id, @RequestParam("quantity") int quantity);
}
