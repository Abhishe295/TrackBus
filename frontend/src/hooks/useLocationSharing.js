// import { useEffect, useRef } from "react";
// import useSocketStore from "../store/useSocketStore";

// const LOCATION_INTERVAL = 5000; // 5 seconds (safe & battery friendly)

// const useLocationSharing = (userId) => {
//   const sendPing = useSocketStore((s) => s.sendPing);
//   const sharingBus = useSocketStore((s) => s.sharingBus);
//   const connected = useSocketStore((s) => s.connected);

//   const watchIdRef = useRef(null);
//   const lastSentRef = useRef(0);

//   useEffect(() => {
//     // ❌ Not ready → stop tracking
//     if (!sharingBus || !userId || !connected) {
//       if (watchIdRef.current !== null) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//         watchIdRef.current = null;
//       }
//       return;
//     }

//     if (!navigator.geolocation) {
//       console.error("Geolocation not supported");
//       return;
//     }

//     // 🔥 Start watching location
//     watchIdRef.current = navigator.geolocation.watchPosition(
//       (pos) => {
//         const now = Date.now();

//         // ⏱ throttle pings
//         if (now - lastSentRef.current < LOCATION_INTERVAL) return;
//         lastSentRef.current = now;

//         sendPing({
//           busNumber: sharingBus,
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//           userId,
//         });
//       },
//       (err) => {
//         console.warn("Location error:", err.message);
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 5000,
//         timeout: 20000,
//       }
//     );

//     // 🧹 cleanup
//     return () => {
//       if (watchIdRef.current !== null) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//         watchIdRef.current = null;
//       }
//     };
//   }, [sharingBus, userId, connected, sendPing]);
// };

// export default useLocationSharing;
import { useEffect, useRef } from "react";
import useSocketStore from "../store/useSocketStore";

const LOCATION_INTERVAL = 2000; // faster for demo (2s)

const useLocationSharing = (userId) => {
  const sendPing = useSocketStore((s) => s.sendPing);
  const sharingBus = useSocketStore((s) => s.sharingBus);
  const connected = useSocketStore((s) => s.connected);

  const intervalRef = useRef(null);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!sharingBus || !userId || !connected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 🎯 Starting point (match your seeded PB-07)
    let baseLat = 31.2455;
    let baseLng = 75.695;

    stepRef.current = 0;

    intervalRef.current = setInterval(() => {
      stepRef.current += 1;

      // 🔥 Smooth curved movement
      const lat =
        baseLat + 0.0001 * stepRef.current;

      const lng =
        baseLng + 0.00005 * Math.sin(stepRef.current / 3);

      sendPing({
        busNumber: sharingBus,
        lat,
        lng,
        userId,
      });

    }, LOCATION_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sharingBus, userId, connected, sendPing]);
};

export default useLocationSharing;

