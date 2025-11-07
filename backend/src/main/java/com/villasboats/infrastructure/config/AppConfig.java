package com.villasboats.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Application-level configuration for beans and services.
 */
@Configuration
public class AppConfig {

    /**
     * RestTemplate bean for making HTTP requests to external services.
     * Used by WebhookService for n8n integration.
     *
     * @return Configured RestTemplate instance
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
