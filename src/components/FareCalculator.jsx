import { useState } from 'react';
import api from '../api/axios';

const FareCalculator = ({ onFareCalculated }) => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [fareDetails, setFareDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculateFare = async () => {
    if (!pickup || !drop) {
      setError('Please enter both pickup and drop locations');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/fare/calculate', {
        pickup,
        drop
      });
      
      setFareDetails(response.data);
      if (onFareCalculated) {
        onFareCalculated(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to calculate fare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Calculate Fare</h3>
      
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Drop Location"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        
        <button
          onClick={handleCalculateFare}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Calculating...' : 'Calculate Fare'}
        </button>
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {fareDetails && !error && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="font-bold">{fareDetails.distanceKm} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-bold">{fareDetails.durationMin} min</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Fare</p>
              <p className="font-bold">₹{fareDetails.fare}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FareCalculator;