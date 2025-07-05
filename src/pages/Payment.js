import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Payment() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // Get booking details from navigation state
  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
    } else {
      // If no booking details, redirect back to booking
      navigate("/book-ride");
    }
  }, [location, navigate]);

  const handlePaymentSubmit = async () => {
    if (!bookingDetails || !token) return;
    
    setIsProcessing(true);
    setError("");
    
    try {
      // In a real app, you would process payment here
      // For now, we'll simulate payment processing
      
      // First, create the ride in your backend
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
      
      // Then create payment record
      await axios.post(
        "http://localhost:8080/api/payments",
        {
          rideId,
          amount: bookingDetails.fare,
          paymentMethod
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Navigate to confirmation page
      navigate("/booking-confirmation", {
        state: {
          bookingId: rideId,
          amount: bookingDetails.fare
        }
      });
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
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
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="radio"
              id="credit_card"
              name="payment"
              value="credit_card"
              checked={paymentMethod === "credit_card"}
              onChange={() => setPaymentMethod("credit_card")}
              className="mr-2"
            />
            <label htmlFor="credit_card">Credit Card</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="debit_card"
              name="payment"
              value="debit_card"
              checked={paymentMethod === "debit_card"}
              onChange={() => setPaymentMethod("debit_card")}
              className="mr-2"
            />
            <label htmlFor="debit_card">Debit Card</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="upi"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
              className="mr-2"
            />
            <label htmlFor="upi">UPI</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="wallet"
              name="payment"
              value="wallet"
              checked={paymentMethod === "wallet"}
              onChange={() => setPaymentMethod("wallet")}
              className="mr-2"
            />
            <label htmlFor="wallet">Wallet</label>
          </div>
        </div>
      </div>
      
      {paymentMethod === "credit_card" && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-3">Credit Card Details</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full px-4 py-2 border rounded"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>
      )}
      
      <button
        onClick={handlePaymentSubmit}
        disabled={isProcessing}
        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold ${
          isProcessing ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {isProcessing ? "Processing Payment..." : "Pay ₹" + bookingDetails.fare}
      </button>
    </div>
  );
}