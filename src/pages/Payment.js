import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Payment() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
    } else {
      navigate("/book-ride");
    }
  }, [location, navigate]);

  const handlePaymentSubmit = async () => {
    if (!bookingDetails || !token) return;

    setIsProcessing(true);
    setError("");

    try {
      const rideResponse = await axios.post(
        "http://localhost:8080/api/rides/book",
        {
          pickupLocation: bookingDetails.pickup,
          dropLocation: bookingDetails.drop,
          distance: bookingDetails.distance,
          fare: bookingDetails.fare,
          rideType: bookingDetails.rideType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const rideId = rideResponse.data.id;

      // Simulate success
      navigate("/booking-confirmation", {
        state: {
          bookingId: rideId,
          amount: bookingDetails.fare,
          paymentStatus: "✅ Payment Successful (Cash). Please pay the driver directly."
        }
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError("PAYMENT SUCCESSFUL (CASH). Please pay the driver directly.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-3">Booking Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Pickup:</span>
            <span className="font-medium">{bookingDetails.pickup}</span>
          </div>
          <div className="flex justify-between">
            <span>Drop:</span>
            <span className="font-medium">{bookingDetails.drop}</span>
          </div>
          <div className="flex justify-between">
            <span>Distance:</span>
            <span className="font-medium">{bookingDetails.distance} km</span>
          </div>
          <div className="flex justify-between">
            <span>Ride Type:</span>
            <span className="font-medium">{bookingDetails.rideType}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
            <span>Total Amount:</span>
            <span>₹{bookingDetails.fare}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
        <div className="flex items-center">
          <input
            type="radio"
            id="cash"
            name="payment"
            checked
            readOnly
            className="mr-2"
          />
          <label htmlFor="cash">💵 Cash</label>
        </div>
      </div>

      <button
        onClick={handlePaymentSubmit}
        disabled={isProcessing}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold ${
          isProcessing ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {isProcessing ? "Booking Ride..." : `Pay ₹${bookingDetails.fare}`}
      </button>
    </div>
  );
}
