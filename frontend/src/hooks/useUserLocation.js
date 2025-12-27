import { useEffect, useState } from "react";

const useUserLocation = (enabled = true) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

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
        setError(null);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setError(err.message);
      },
      {
        enableHighAccuracy: true,   // ✅ FORCE GPS
        timeout: 20000,
        maximumAge: 0,              // ✅ NO CACHING
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  return { location, error };
};

export default useUserLocation;
