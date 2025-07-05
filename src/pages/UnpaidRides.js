import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UnpaidRides() {
  const [rides, setRides] = useState([]);

  const fetchRides = async () => {
    try {
      const res = await api.get("/rides/my");
      const unpaid = res.data.filter(
        (ride) => ride.status === "COMPLETED" && !ride.farePaid
      );
      setRides(unpaid);
    } catch (err) {
      alert("Failed to load rides");
    }
  };

  const payForRide = async (rideId, method) => {
    try {
      await api.post("/payments/pay", {
        rideId,
        method,
      });
      alert("Payment successful!");
      fetchRides();
    } catch {
      alert("Payment failed");
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div>
      <h2>Pending Payments</h2>
      {rides.length === 0 ? (
        <p>No pending rides for payment</p>
      ) : (
        <ul>
          {rides.map((ride) => (
            <li key={ride.id}>
              <p><b>Pickup:</b> {ride.pickupLocation}</p>
              <p><b>Drop:</b> {ride.dropLocation}</p>
              <p><b>Fare:</b> ₹{ride.fare.toFixed(2)}</p>
              <button onClick={() => payForRide(ride.id, "CASH")}>Pay by Cash</button>
              <button onClick={() => payForRide(ride.id, "CARD")}>Pay by Card</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
