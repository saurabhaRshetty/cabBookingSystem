import React from "react";
import { Car, Lock, Clock, Star, Leaf, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-lg">
              <Car className="text-blue-600 h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Your Ride, Your Way
          </h1>
          <p className="text-lg mb-8">
            Experience the future of transportation with RideEase. Safe, reliable, and eco-friendly rides at your fingertips.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate("/login")} className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition">
              🚗 LOGIN
            </button>
            <button onClick={() => navigate("/register")} className="border border-white text-white font-semibold px-6 py-2 rounded hover:bg-white hover:text-blue-600 transition">
              👤 REGISTER
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose RideEase */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Why Choose RideEase?</h2>
          <p className="text-gray-600 mb-12">Revolutionizing urban transportation with cutting-edge tech and uncompromising safety standards.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <FeatureCard icon={<MapPin />} title="Easy Booking" desc="Book rides in seconds with our intuitive interface." />
            <FeatureCard icon={<Lock />} title="Safe & Secure" desc="Verified drivers and secure payments." />
            <FeatureCard icon={<Clock />} title="Quick Rides" desc="Get matched with drivers instantly." />
            <FeatureCard icon={<Star />} title="Top Rated" desc="4.8+ star rating from thousands of users." />
            <FeatureCard icon={<Leaf />} title="Eco-Friendly" desc="Choose from electric & hybrid vehicles." />
            <FeatureCard icon={<Users />} title="Share Rides" desc="Share trip details with friends & family." />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-5xl mx-auto px-4 text-center grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat number="50K+" label="Happy Riders" />
          <Stat number="5K+" label="Verified Drivers" />
          <Stat number="100K+" label="Completed Rides" />
          <Stat number="4.9" label="Average Rating" />
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">Join thousands of happy users and book your first ride today.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition"
        >
          🚀 Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">RideEase</h4>
            <p className="text-sm">Making transportation safer, easier, and more sustainable for everyone.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Company</h4>
            <ul className="space-y-1 text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Support</h4>
            <ul className="space-y-1 text-sm">
              <li>Help Center</li>
              <li>Safety</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm mt-8 text-gray-400">
          © 2024 RideEase. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// 🧩 Reusable Components
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-left">
      <div className="text-blue-600 mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <p className="text-3xl font-extrabold text-blue-600">{number}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}