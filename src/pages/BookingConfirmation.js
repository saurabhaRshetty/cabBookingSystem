import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function BookingConfirmation() {
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const amount = location.state?.amount;
  
  if (!bookingId) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
        <p>We couldn't find your booking details.</p>
        <Link to="/book-ride" className="mt-4 inline-block text-blue-600 hover:underline">
          Book a new ride
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <div className="text-green-500 text-6xl mb-4">✓</div>
      <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
      <p className="text-lg mb-4">Your ride has been successfully booked.</p>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
        <h2 className="text-lg font-semibold mb-3">Booking Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Booking ID:</span>
            <span className="font-medium">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Paid:</span>
            <span className="font-medium">₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium text-green-600">Confirmed</span>
          </div>
        </div>
      </div>
      
      <p className="mb-6">
        A confirmation has been sent to your email. Your driver will arrive shortly.
      </p>
      
      <div className="flex justify-center gap-4">
        <Link
          to="/my-rides"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View My Rides
        </Link>
        <Link
          to="/book-ride"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Book Another Ride
        </Link>
      </div>
    </div>
  );
}