package com.ibatulanand.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http.csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Phải có dòng này
                        .pathMatchers("/eureka/**", "/realms/**").permitAll()
                        .pathMatchers("/api/**").authenticated() // Chỉ yêu cầu token cho các GET/POST thực
                        .anyExchange().authenticated()
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((exchange, ex) -> {
                            System.out.println("🔴 Authentication failed: " + ex.getMessage());
                            System.out.println("🔴 Request: " + exchange.getRequest().getMethod() + " " + exchange.getRequest().getPath());
                            ServerHttpResponse response = exchange.getResponse();
                            response.setStatusCode(HttpStatus.UNAUTHORIZED);
                            // Add CORS headers manually for 401 responses
                            response.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:4200");
                            response.getHeaders().add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
                            response.getHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");
                            response.getHeaders().add("Access-Control-Allow-Credentials", "true");
                            return response.setComplete();
                        })
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwtSpec -> {
                            ReactiveJwtAuthenticationConverter jwtConverter = new ReactiveJwtAuthenticationConverter();
                            jwtSpec.jwtAuthenticationConverter(jwt -> {
                                Jwt token = jwt;
                                System.out.println("🔑 JWT Claims: " + token.getClaims());
                                System.out.println("🔑 JWT Issuer: " + token.getIssuer());
                                System.out.println("🔑 JWT Audience: " + token.getAudience());
                                System.out.println("🔑 JWT Token value: " + token.getTokenValue());
                                return jwtConverter.convert(token);
                            });
                        })
                        .authenticationFailureHandler((webFilterExchange, exception) -> {
                            System.out.println("🔴 OAuth2 authentication failed: " + exception.getMessage());
                            return Mono.error(exception);
                        })
                );
        System.out.println("🔒 Security Filter Chain initialized");
        return http.build();
    }
}
