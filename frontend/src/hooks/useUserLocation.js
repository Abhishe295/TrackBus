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

    let watchId;

    // 1️⃣ QUICK INITIAL FIX (important)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: false, // 🔑 fast first fix
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    // 2️⃣ CONTINUOUS TRACKING (after permission + GPS warmup)
    watchId = navigator.geolocation.watchPosition(
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
        enableHighAccuracy: true, // 🔥 GPS once warmed
        timeout: 30000,           // ⬅️ IMPORTANT
        maximumAge: 5000,
      }
    );

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled]);

  return { location, error };
};

export default useUserLocation;
