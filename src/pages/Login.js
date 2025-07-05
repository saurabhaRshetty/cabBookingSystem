import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username,
        password
      });

      console.log(res);

      if (res.status === 200) {
        const { token, role } = res.data;
        login(token);

        if (role === "DRIVER") {
          navigate("/driver");
        } else if (role === "RIDER") {
          navigate("/dashboard");
        } else {
          navigate("/admin");
        }
      } else {
        setError("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        {/* Back to Home Link */}
        <div className="text-center mb-4">
          <Link to="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {location.state?.registrationSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
            Registration successful! Please log in.
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        
        <input
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}