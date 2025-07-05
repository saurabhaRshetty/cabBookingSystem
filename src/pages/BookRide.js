import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

mapboxgl.accessToken = "pk.eyJ1IjoiZGhhbnlhNTYiLCJhIjoiY21jcDZhdWhyMDM0ZTJrcjNiYWJ3dGI4aCJ9.k-RRSsIsHs5RntZPxkhiEQ";

export default function BookRide() {
  const { token, user } = useAuth();
  const navigate = useNavigate(); // Initialize navigate function
  
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rideType, setRideType] = useState("Standard");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [fare, setFare] = useState("");
  const [clickStage, setClickStage] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropMarker, setDropMarker] = useState(null);
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [77.59, 12.97], // Bengaluru
        zoom: 10,
      });
      
      mapInstance.current.on("click", handleMapClick);
    }
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Handle map clicks for setting pickup/drop locations
  const handleMapClick = (e) => {
    if (!clickStage) return;
    
    const coords = [e.lngLat.lng, e.lngLat.lat];
    
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxgl.accessToken}`
    )
      .then(res => res.json())
      .then(data => {
        const locationName = data.features[0]?.place_name || "Selected location";
        
        if (clickStage === "pickup") {
          setPickup(locationName);
          addMarker(coords, "green");
          setClickStage("drop");
        } else {
          setDrop(locationName);
          addMarker(coords, "red");
          setClickStage(null);
        }
      })
      .catch(err => {
        console.error("Geocoding error:", err);
        setError("Failed to get location name");
      });
  };

  // Add marker to the map
  const addMarker = (coords, color) => {
    if (color === "green" && pickupMarker) pickupMarker.remove();
    if (color === "red" && dropMarker) dropMarker.remove();
    
    const marker = new mapboxgl.Marker({ color })
      .setLngLat(coords)
      .addTo(mapInstance.current);
    
    if (color === "green") setPickupMarker(marker);
    if (color === "red") setDropMarker(marker);
  };

  // Calculate fare using backend API
  const handleCalculateFare = async () => {
    if (!pickup || !drop) {
      setError("Please enter both locations");
      return;
    }
    
    if (!token) {
      setError("You need to be logged in to calculate fare");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/fare/calculate",
        { pickup, drop },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const { distanceKm, durationMin, fare } = res.data;
      setDistance(distanceKm);
      setDuration(durationMin);
      setFare(fare);
      setError("");
      drawRoute();
    } catch (err) {
      console.error("Fare calculation error:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to calculate fare. Please try again.");
      }
    }
  };

  // Draw route on the map
  const drawRoute = async () => {
    if (!pickup || !drop) return;

    const fetchCoords = async (place) => {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          place
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      return data.features[0].center;
    };

    try {
      const [start, end] = await Promise.all([fetchCoords(pickup), fetchCoords(drop)]);

      // Add markers
      addMarker(start, "green");
      addMarker(end, "red");

      const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const routeRes = await fetch(routeUrl);
      const routeData = await routeRes.json();
      const route = routeData.routes[0].geometry;

      // Draw route on map
      if (mapInstance.current.getSource("route")) {
        mapInstance.current.getSource("route").setData(route);
      } else {
        mapInstance.current.addSource("route", {
          type: "geojson",
          data: route,
        });

        mapInstance.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#3b82f6",
            "line-width": 4,
          },
        });
      }

      // Fit map to route bounds
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(start);
      bounds.extend(end);
      mapInstance.current.fitBounds(bounds, { padding: 50 });
    } catch (err) {
      console.error("Route drawing error:", err);
      setError("Failed to draw route on map");
    }
  };

  // Handle booking confirmation - navigate to payment page
  const handleConfirmBooking = async () => {
    if (!pickup || !drop || !fare) {
      setError("Please calculate fare first");
      return;
    }
    
    if (!token) {
      setError("You need to be logged in to book a ride");
      return;
    }
    
    setIsBooking(true);
    setError("");
    
    try {
      // In a real app, you would create a ride booking here
      // For now, we'll just prepare the data for payment
      const bookingData = {
        pickup,
        drop,
        distance,
        duration,
        fare,
        rideType,
        userId: user?.id,
        username: user?.username
      };
      
      // Navigate to payment page with booking data
      navigate("/payment", {
        state: {
          bookingDetails: bookingData
        }
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Book a Ride</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Map and Controls */}
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-3">Map Controls</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded ${
                  clickStage === "pickup" 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setClickStage("pickup")}
              >
                {clickStage === "pickup" ? "Selecting Pickup..." : "Set Pickup on Map"}
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  clickStage === "drop" 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setClickStage("drop")}
                disabled={!pickup}
              >
                {clickStage === "drop" ? "Selecting Drop..." : "Set Drop on Map"}
              </button>
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  setClickStage(null);
                  setPickup("");
                  setDrop("");
                  setDistance("");
                  setDuration("");
                  setFare("");
                  setError("");
                  if (pickupMarker) pickupMarker.remove();
                  if (dropMarker) dropMarker.remove();
                  if (mapInstance.current.getSource("route")) {
                    mapInstance.current.removeLayer("route");
                    mapInstance.current.removeSource("route");
                  }
                }}
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div
            ref={mapRef}
            className="w-full h-[500px] rounded-lg shadow-md border"
          ></div>
        </div>
        
        {/* Right Column: Booking Details */}
        <div className="space-y-6">
          {/* Ride Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ride Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Pickup Location</label>
                <input
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Drop Location</label>
                <input
                  placeholder="Enter drop location"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Ride Type</label>
                <select
                  className="w-full px-4 py-2 border rounded"
                  value={rideType}
                  onChange={(e) => setRideType(e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium (+20%)</option>
                  <option value="SUV">SUV (+50%)</option>
                </select>
              </div>
              
              <button
                onClick={handleCalculateFare}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={!token}
              >
                {token ? "Calculate Fare" : "Login to Calculate Fare"}
              </button>
            </div>
          </div>
          
          {/* Fare Details Card */}
          {(distance || fare) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Fare Details</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="font-medium">{distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Duration:</span>
                  <span className="font-medium">{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Ride Type:</span>
                  <span className="font-medium">{rideType}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t">
                  <span>Total Fare:</span>
                  <span>₹{fare}</span>
                </div>
              </div>
              
              <button
                onClick={handleConfirmBooking}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                disabled={!token || isBooking}
              >
                {isBooking ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}