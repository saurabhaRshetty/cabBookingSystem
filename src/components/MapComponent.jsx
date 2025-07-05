// src/components/MapComponent.jsx
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Use environment variable for token (create .env file in root)
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function MapComponent({ onFareCalculated }) {
  const mapRef = useRef(null);
  const map = useRef(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [clickStage, setClickStage] = useState("pickup");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fare, setFare] = useState(null);

  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropMarker, setDropMarker] = useState(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.59, 12.97], // Bengaluru
      zoom: 11,
    });

    map.current.on("click", handleMapClick);
    
    return () => map.current.remove();
  }, []);

  const handleMapClick = (e) => {
    const coords = [e.lngLat.lng, e.lngLat.lat];

    if (clickStage === "pickup") {
      setPickupCoords(coords);
      setClickStage("drop");

      if (pickupMarker) pickupMarker.remove();
      const marker = new mapboxgl.Marker({ color: "green" })
        .setLngLat(coords)
        .addTo(map.current);
      setPickupMarker(marker);
    } else {
      setDropCoords(coords);
      setClickStage("pickup");

      if (dropMarker) dropMarker.remove();
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(coords)
        .addTo(map.current);
      setDropMarker(marker);
    }
  };

  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupCoords && dropCoords) {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropCoords[0]},${dropCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        const res = await fetch(url);
        const data = await res.json();
        const route = data.routes[0];

        setDistance((route.distance / 1000).toFixed(2));
        setDuration(Math.round(route.duration / 60));
        const calculatedFare = 50 + Math.max(0, (route.distance / 1000 - 2)) * 15;
        setFare(Math.round(calculatedFare));
        
        // Pass fare details to parent component
        if (onFareCalculated) {
          onFareCalculated({
            distanceKm: (route.distance / 1000).toFixed(2),
            durationMin: Math.round(route.duration / 60),
            fare: Math.round(calculatedFare),
          });
        }

        // Draw route
        if (map.current.getSource("route")) {
          map.current.getSource("route").setData(route.geometry);
        } else {
          map.current.addSource("route", {
            type: "geojson",
            data: route.geometry,
          });

          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            paint: {
              "line-color": "#3b82f6",
              "line-width": 4,
            },
          });
        }

        map.current.fitBounds([
          pickupCoords,
          dropCoords
        ], { padding: 50 });
      }
    };

    fetchRoute();
  }, [pickupCoords, dropCoords, onFareCalculated]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Click to Select Pickup & Drop</h2>
      <div
        ref={mapRef}
        className="w-full h-[500px] mb-4 rounded shadow"
        style={{ maxWidth: "1000px" }}
      ></div>

      <div className="bg-white p-4 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Fare Estimate</h3>
        <p>Pickup: {pickupCoords ? pickupCoords.join(", ") : "Not selected"}</p>
        <p>Drop: {dropCoords ? dropCoords.join(", ") : "Not selected"}</p>
        <p>Distance: {distance ? `${distance} km` : "--"}</p>
        <p>Duration: {duration ? `${duration} min` : "--"}</p>
        <p>Total Fare: {fare ? `₹${fare}` : "--"}</p>
      </div>
    </div>
  );
}