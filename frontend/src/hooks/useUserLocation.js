import { useEffect, useState } from "react";

const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null); // clear error once we succeed
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setError(err.message);
      },
      {
        enableHighAccuracy: false,   // 🔥 IMPORTANT
        timeout: 30000,              // 🔥 give more time
        maximumAge: 10000,           // 🔥 reuse last known position
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};

export default useUserLocation;
