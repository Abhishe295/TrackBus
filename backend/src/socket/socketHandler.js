import LiveSession from "../model/liveSessionModel.js";
import { v4 as uuidv4 } from "uuid";

const HEARTBEAT_TIMEOUT = 45000;

const toRad = (v) => (v * Math.PI) / 180;

const distanceInMeters = (a, b) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("session:start", async ({ busNumber, userId }) => {
      const now = new Date();
const session = await LiveSession.findOneAndUpdate(
  { busNumber },
  {
    $set: {
      active: true,
      lastPingAt: now,
      confidence: "LIVE",
      lastContributor: userId || null,
    },
    $setOnInsert: {
      sessionId: uuidv4(),
      startedAt: now,
      path: [],
      initialPosition: null,
      lastMovementAt: now,
    },
  },
  { new: true, upsert: true }
);



      socket.join(`bus:${busNumber}`);

      io.to(`bus:${busNumber}`).emit("session:confidence", {
        busNumber,
        confidence: "LIVE",
      });

      socket.emit("session:joined", {
        busNumber,
        sessionId: session.sessionId,
        confidence: session.confidence || "LIVE",
        lastLocation: session.lastLocation || null,
      });
    });

    socket.on("driver:location", async ({ busNumber, lat, lng, userId }) => {
      const now = new Date();

      const session = await LiveSession.findOneAndUpdate(
        { busNumber },
        {
          $setOnInsert: {
            sessionId: uuidv4(),
            startedAt: now,
            path: [],
            initialPosition: null,
            lastMovementAt: now,
            lastPingAt: now,
            confidence: "LIVE",
            active: true,
          },
        },
        { new: true, upsert: true }
      );

      if (!session.lastMovementAt) {
        session.lastMovementAt = now;
      }

      const newPoint = { lat, lng, at: now };
      let moved = false;

      if (session.lastLocation) {
        const dist = distanceInMeters(session.lastLocation, newPoint);

        if (dist >= 1.0) {
          moved = true;
          session.lastMovementAt = now;
        }

        if (dist < 5 && now - session.lastMovementAt > 10 * 60 * 1000) {
          session.path = [];
          session.initialPosition = null;
        }
      } else {
        moved = true;
      }

      if (!session.initialPosition && moved) {
        session.initialPosition = { lat, lng };
      }

      if (moved) {
        session.path.push(newPoint);
      }

      session.lastLocation = newPoint;
      session.lastPingAt = now;
      session.lastContributor = userId || null;
      session.active = true;
      session.confidence = "LIVE";

      await session.save();

      io.to(`bus:${busNumber}`).emit("bus:location", {
        busNumber,
        lat,
        lng,
        path: session.path,
        confidence: session.confidence,
      });
    });

    socket.on("session:stopSharing", async ({ busNumber }) => {
      const session = await LiveSession.findOne({ busNumber });
      if (!session) return;
      session.lastContributor = null;
      session.lastPingAt = new Date();
      await session.save();
    });

    socket.on("disconnect", () => {});
  });

  setInterval(async () => {
    const now = Date.now();
    const sessions = await LiveSession.find({ active: true });

    for (const session of sessions) {
      const diff = now - new Date(session.lastPingAt).getTime();

      if (diff > HEARTBEAT_TIMEOUT) {
        session.active = false;
        session.confidence = "OFFLINE";
        session.path = [];
        session.initialPosition = null;
        await session.save();

        io.to(`bus:${session.busNumber}`).emit("bus:location", {
          busNumber: session.busNumber,
          lat: null,
          lng: null,
          path: [],
          confidence: "OFFLINE",
        });
      } else if (diff > 10000) {
        session.confidence = "DELAYED";
        await session.save();

        io.to(`bus:${session.busNumber}`).emit("session:confidence", {
          busNumber: session.busNumber,
          confidence: "DELAYED",
        });
      }
    }
  }, 10000);
};