import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "RIDER",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!form.username || !form.password || !form.email) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }
    
    if (!isPasswordValid(form.password)) {
      setError("Password must be at least 6 characters with 1 uppercase letter and 1 digit");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const payload = {
        ...form,
        role: form.role.toUpperCase()
      };
      
      const response = await api.post("/auth/register", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      navigate("/login", { state: { registrationSuccess: true } });
    } catch (error) {
      const errorMessage = error.response?.data || 
                          error.response?.message || 
                          "Registration failed. Please try again.";
      console.error("Registration error:", error.response);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordValid = (password) => {
    return password.length >= 6 && 
           /[A-Z]/.test(password) && 
           /\d/.test(password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Back to Home Link */}
        <div className="text-center mb-4">
          <Link to="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              className="w-full px-4 py-2 border rounded"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              className="w-full px-4 py-2 border rounded"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              className="w-full px-4 py-2 border rounded"
              name="password"
              placeholder="Min 6 chars, 1 uppercase, 1 digit"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Account Type</label>
            <select
              className="w-full px-4 py-2 border rounded"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="RIDER">Rider (Book cabs)</option>
              <option value="DRIVER">Driver (Offer rides)</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-blue-600 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}