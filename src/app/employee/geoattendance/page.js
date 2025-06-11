"use client"
// components/MarkAttendance.js
import { useState } from 'react';

export default function MarkAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [distance, setDistance] = useState(null);

  // Coordinates of your required location
  const REQUIRED_LOCATION = {
    lat: 23.304854628541285, // Replace with your location's latitude
    lng: 77.3516729703418, // Replace with your location's longitude
    radius: 100 // Allowed radius in meters
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const markAttendance = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get user's current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Calculate distance from required location
      const dist = calculateDistance(
        latitude,
        longitude,
        REQUIRED_LOCATION.lat,
        REQUIRED_LOCATION.lng
      );
      
      setDistance(dist);

      if (dist > REQUIRED_LOCATION.radius) {
        throw new Error(`You're ${Math.round(dist)}m away from the required location.`);
      }

      // Call API to mark attendance
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: latitude,
          lng: longitude,
          distance: dist,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark attendance');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="attendance-container">
      <h2>Mark Your Attendance</h2>
      
      <button 
        onClick={markAttendance} 
        disabled={isLoading}
        className="mark-attendance-btn"
      >
        {isLoading ? 'Checking Location...' : 'Mark Attendance'}
      </button>

      {distance !== null && (
        <p className="distance-info">
          You're {Math.round(distance)} meters from the required location.
        </p>
      )}

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Attendance marked successfully!</p>}

      <style jsx>{`
        .attendance-container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 1.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          text-align: center;
        }
        .mark-attendance-btn {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .mark-attendance-btn:hover {
          background-color: #0061d5;
        }
        .mark-attendance-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .error-message {
          color: #ff0000;
          margin-top: 1rem;
        }
        .success-message {
          color: #008000;
          margin-top: 1rem;
        }
        .distance-info {
          margin-top: 1rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}