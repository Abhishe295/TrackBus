import { create } from "zustand";
import socket from "../lib/socket.js";

let listenersAttached = false;

const useSocketStore = create((set, get) => {
  // 🔑 restore sharing immediately (BEFORE first render)
  const savedSharingBus = localStorage.getItem("sharingBus");

  return {
    // =====================
    // GLOBAL STATE
    // =====================
    connected: false,

    activeBus: savedSharingBus || null,
    sharingBus: savedSharingBus || null,

    buses: {},

    // =====================
    // SOCKET LIFECYCLE
    // =====================
    connect: () => {
      if (!socket.connected) {
        socket.connect();
      }
    },

    disconnect: () => {
      socket.disconnect();
      set({
        connected: false,
        activeBus: null,
        sharingBus: null,
        buses: {},
      });
    },

    // =====================
    // SESSION CONTROL
    // =====================
    joinSession: (busNumber) => {
      const { connect, listen } = get();
      connect();
      listen();

      socket.emit("session:start", { busNumber });

      set((state) => ({
        activeBus: busNumber,
        buses: {
          ...state.buses,
          [busNumber]: state.buses[busNumber] || {
            location: null,
            path: [],
            confidence: "OFFLINE",
            sessionActive: false,
          },
        },
      }));
    },

    startSharing: ({ busNumber, userId }) => {
      const { connect, listen } = get();
      connect();
      listen();

      socket.emit("session:start", { busNumber, userId });

      localStorage.setItem("sharingBus", busNumber);

      set({
        sharingBus: busNumber,
        activeBus: busNumber,
      });
    },

    stopSharing: () => {
      const { sharingBus } = get();
      if (!sharingBus) return;

      socket.emit("session:stopSharing", { busNumber: sharingBus });

      localStorage.removeItem("sharingBus");

      set({ sharingBus: null });
    },

    // =====================
    // LOCATION UPDATE
    // =====================
    sendPing: ({ busNumber, lat, lng, userId }) => {
      const { sharingBus, connect } = get();
      if (!busNumber || sharingBus !== busNumber) return;

      connect();

      socket.emit("driver:location", {
        busNumber,
        lat,
        lng,
        userId,
      });
    },

    // =====================
    // SOCKET LISTENERS
    // =====================
    listen: () => {
      if (listenersAttached) return;
      listenersAttached = true;

      socket.on("connect", () => {
        set({ connected: true });
      });

      socket.on("disconnect", () => {
        set({ connected: false });
      });

      socket.on("session:joined", ({ busNumber, confidence, lastLocation }) => {
        set((state) => ({
          buses: {
            ...state.buses,
            [busNumber]: {
              ...(state.buses[busNumber] || {}),
              location: lastLocation || null,
              confidence: confidence || "LIVE",
              sessionActive: true,
            },
          },
        }));
      });

      socket.on("bus:location", ({ busNumber, lat, lng, path, confidence }) => {
        set((state) => ({
          buses: {
            ...state.buses,
            [busNumber]: {
              ...(state.buses[busNumber] || {}),
              location:
                lat !== null && lng !== null ? { lat, lng } : null,
              path: path ?? state.buses[busNumber]?.path ?? [],
              confidence: confidence ?? "LIVE",
              sessionActive: confidence !== "OFFLINE",
            },
          },
        }));
      });

      socket.on("session:confidence", ({ busNumber, confidence }) => {
        set((state) => ({
          buses: {
            ...state.buses,
            [busNumber]: {
              ...(state.buses[busNumber] || {}),
              confidence,
              sessionActive: confidence !== "OFFLINE",
            },
          },
        }));
      });

      socket.on("session:ended", ({ busNumber }) => {
        set((state) => ({
          buses: {
            ...state.buses,
            [busNumber]: {
              ...(state.buses[busNumber] || {}),
              location: null,
              path: [],
              confidence: "OFFLINE",
              sessionActive: false,
            },
          },
        }));
      });
    },

    resumeSharing: ({ userId }) => {
  const { sharingBus, connect, listen } = get();
  if (!sharingBus || !userId) return;

  connect();
  listen();

  // 🔥 force re-emit session:start WITH userId
  socket.emit("session:start", {
    busNumber: sharingBus,
    userId,
  });
},


    // ⚠️ DO NOT CALL THIS ON PAGE UNMOUNT
    // Only use on logout / full app shutdown
    cleanup: () => {
      listenersAttached = false;
      socket.off("connect");
      socket.off("disconnect");
      socket.off("session:joined");
      socket.off("bus:location");
      socket.off("session:confidence");
      socket.off("session:ended");
    },
  };
});

export default useSocketStore;
