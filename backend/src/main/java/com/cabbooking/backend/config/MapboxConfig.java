package com.cabbooking.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class MapboxConfig {

    @Value("${mapbox.api.key}")
    private String mapboxApiKey;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getMapboxApiKey() {
        return mapboxApiKey;
    }
}