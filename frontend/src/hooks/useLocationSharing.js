import { useEffect, useRef } from "react";
import useSocketStore from "../store/useSocketStore";

const LOCATION_INTERVAL = 5000; // 5 seconds (safe & battery friendly)

const useLocationSharing = (userId) => {
  const sendPing = useSocketStore((s) => s.sendPing);
  const sharingBus = useSocketStore((s) => s.sharingBus);
  const connected = useSocketStore((s) => s.connected);

  const watchIdRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    // ❌ Not ready → stop tracking
    if (!sharingBus || !userId || !connected) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    // 🔥 Start watching location
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();

        // ⏱ throttle pings
        if (now - lastSentRef.current < LOCATION_INTERVAL) return;
        lastSentRef.current = now;

        sendPing({
          busNumber: sharingBus,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          userId,
        });
      },
      (err) => {
        console.warn("Location error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 20000,
      }
    );

    // 🧹 cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [sharingBus, userId, connected, sendPing]);
};

export default useLocationSharing;
