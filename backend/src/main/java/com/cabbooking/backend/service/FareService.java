package com.cabbooking.backend.service;

import com.cabbooking.backend.config.MapboxConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Service
public class FareService {

    private final RestTemplate restTemplate;
    private final MapboxConfig mapboxConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public FareService(RestTemplate restTemplate, MapboxConfig mapboxConfig) {
        this.restTemplate = restTemplate;
        this.mapboxConfig = mapboxConfig;
    }

    public Map<String, Object> calculateFare(String pickup, String drop) {
        try {
            // Step 1: Geocode pickup location
            double[] pickupCoords = geocodeLocation(pickup);

            // Step 2: Geocode drop location
            double[] dropCoords = geocodeLocation(drop);

            // Step 3: Get directions
            Map<String, Object> directions = getDirections(pickupCoords, dropCoords);

            // Step 4: Calculate fare
            return calculateFareDetails(directions);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to calculate fare: " + e.getMessage());
            return error;
        }
    }

    private double[] geocodeLocation(String location) throws Exception {
        String url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
                location.replace(" ", "%20") + ".json";

        URI uri = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("access_token", mapboxConfig.getMapboxApiKey())
                .build()
                .toUri();

        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode firstFeature = root.path("features").get(0);
        JsonNode center = firstFeature.path("center");

        return new double[]{
                center.get(0).asDouble(),
                center.get(1).asDouble()
        };
    }

    private Map<String, Object> getDirections(double[] pickup, double[] drop) throws Exception {
        String url = String.format(
                "https://api.mapbox.com/directions/v5/mapbox/driving/%f,%f;%f,%f",
                pickup[0], pickup[1], drop[0], drop[1]
        );

        URI uri = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("access_token", mapboxConfig.getMapboxApiKey())
                .queryParam("geometries", "geojson")
                .build()
                .toUri();

        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode route = root.path("routes").get(0);

        Map<String, Object> result = new HashMap<>();
        result.put("distance", route.path("distance").asDouble()); // in meters
        result.put("duration", route.path("duration").asDouble()); // in seconds

        return result;
    }

    private Map<String, Object> calculateFareDetails(Map<String, Object> directions) {
        double distanceMeters = (double) directions.get("distance");
        double durationSeconds = (double) directions.get("duration");

        // Convert to km and minutes
        double distanceKm = distanceMeters / 1000.0;
        double durationMin = durationSeconds / 60.0;

        // Fare calculation logic
        double baseFare = 50.0;
        double perKmRate = 15.0;
        double minFare = 80.0;

        double fare = baseFare + (distanceKm * perKmRate);
        fare = Math.max(fare, minFare);

        Map<String, Object> result = new HashMap<>();
        result.put("distanceKm", String.format("%.2f", distanceKm));
        result.put("durationMin", Math.round(durationMin));
        result.put("fare", Math.round(fare));

        return result;
    }
}