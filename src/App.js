// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";  // Add this import
import Login from "./pages/Login";
import BookRide from "./pages/BookRide";
import DriverDashboard from "./pages/DriverDashboard";
import MyRides from "./pages/MyRides";
import DriverAcceptedRides from "./pages/DriverAcceptedRides";
import UnpaidRides from "./pages/UnpaidRides";
import './index.css';
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Set Home as the landing page */}
          <Route path="/" element={<Home />} />
          
          {/* Keep existing routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<BookRide />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/rider/rides" element={<MyRides />} />
          <Route path="/driver/rides" element={<DriverAcceptedRides />} />
          <Route path="/rider/payments" element={<UnpaidRides />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/book-ride" element={<BookRide />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;