package com.eventsphere.api_gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/login",
            "/api/events",
            "/api/tickets",
            "/api/tickets/**",
            "/eureka",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/webjars/**"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> {
                String path = request.getURI().getPath();
                return !(path.startsWith("/auth/") || 
                         path.contains("/api/events") || 
                         path.contains("/api/tickets") ||
                         path.contains("/eureka") ||
                         path.contains("/v3/api-docs") ||
                         path.contains("/swagger-ui"));
            };
}
