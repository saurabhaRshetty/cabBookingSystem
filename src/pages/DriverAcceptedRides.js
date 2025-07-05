import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DriverAcceptedRides() {
  const [rides, setRides] = useState([]);

  const fetchAcceptedRides = async () => {
    try {
      const res = await api.get("/rides/driver");
      setRides(res.data);
    } catch (err) {
      alert("Could not load your rides");
    }
  };

  const completeRide = async (rideId) => {
    try {
      await api.post(`/rides/complete/${rideId}`);
      alert("Ride marked as completed");
      fetchAcceptedRides();
    } catch {
      alert("Failed to complete ride");
    }
  };

  useEffect(() => {
    fetchAcceptedRides();
  }, []);

  return (
    <div>
      <h2>Accepted Rides</h2>
      {rides.length === 0 ? (
        <p>No active rides</p>
      ) : (
        <ul>
          {rides.map((ride) => (
            <li key={ride.id}>
              <p><b>Pickup:</b> {ride.pickupLocation}</p>
              <p><b>Drop:</b> {ride.dropLocation}</p>
              <p><b>Status:</b> {ride.status}</p>
              <p><b>Fare (est):</b> ₹{ride.fare?.toFixed(2) || "Pending"}</p>
              {ride.status !== "COMPLETED" && (
                <button onClick={() => completeRide(ride.id)}>Complete Ride</button>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
