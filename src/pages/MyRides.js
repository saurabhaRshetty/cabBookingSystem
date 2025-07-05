import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyRides() {
  const [rides, setRides] = useState([]);

  const fetchRides = async () => {
    try {
      const res = await api.get("/rides/my");
      setRides(res.data);
    } catch (err) {
      alert("Could not load rides");
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div>
      <h2>My Rides</h2>
      {rides.length === 0 ? (
        <p>No rides booked yet</p>
      ) : (
        <ul>
          {rides.map((ride) => (
            <li key={ride.id}>
              <p><b>Pickup:</b> {ride.pickupLocation}</p>
              <p><b>Drop:</b> {ride.dropLocation}</p>
              <p><b>Status:</b> {ride.status}</p>
              <p><b>Driver:</b> {ride.driver?.username || "Not assigned"}</p>
              <p><b>Fare:</b> ₹{ride.fare?.toFixed(2) || "N/A"}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
