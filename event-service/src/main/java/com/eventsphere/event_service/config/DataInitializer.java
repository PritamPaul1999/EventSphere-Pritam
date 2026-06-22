package com.eventsphere.event_service.config;

import com.eventsphere.event_service.entity.Event;
import com.eventsphere.event_service.repository.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EventRepository repository) {
        return args -> {
            System.out.println("Enforcing 'Original Three' event policy...");
            
            // Delete EVERYTHING to ensure no duplicates or unwanted events exist
            repository.deleteAll();

            System.out.println("Restoring exactly 3 original events...");
            Event e1 = new Event(null, "Global Tech Summit 2026", "The biggest tech conference of the year.", "San Francisco, CA", LocalDate.of(2026, 10, 15), 500, 500, "Technology");
            Event e2 = new Event(null, "Nebula Music Festival", "An immersive music experience under the stars.", "London, UK", LocalDate.of(2026, 11, 20), 2000, 2000, "Music");
            Event e3 = new Event(null, "Design Masters Workshop", "Learn from the world's best designers.", "Berlin, Germany", LocalDate.of(2026, 12, 5), 50, 50, "Design");
            
            repository.saveAll(Arrays.asList(e1, e2, e3));
            System.out.println("Original 3 events are now the only events in the database.");
        };
    }
}
