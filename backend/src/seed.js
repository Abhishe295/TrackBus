import mongoose from "mongoose";
import dotenv from "dotenv";
import Bus from "./model/busModel.js";
import LiveSession from "./model/liveSessionModel.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for seeding");

    // ----------------------------
    // CLEAN OLD DATA (DEV ONLY)
    // ----------------------------
    await Bus.deleteMany({});
    await LiveSession.deleteMany({});

    // ----------------------------
    // SEED BUSES
    // ----------------------------
    const buses = [
      {
        busNumber: "PB-12",
        routeName: "LPU → Phagwara",
        active: true,
      },
      {
        busNumber: "PB-07",
        routeName: "LPU → Jalandhar",
        active: true,
      },
      {
        busNumber: "PB-21",
        routeName: "Phagwara → Jalandhar",
        active: true,
      },
    ];

    await Bus.insertMany(buses);
    console.log("🚌 Buses seeded");

    // ----------------------------
    // OPTIONAL: PRE-SEED A LIVE SESSION
    // (So map + blue trace show instantly)
    // ----------------------------
await LiveSession.insertMany([
  {
    busNumber: "PB-07",
    sessionId: uuidv4(),
    active: true,
    confidence: "LIVE",
    startedAt: new Date(),
    lastPingAt: new Date(),
    lastLocation: {
      lat: 31.2455,
      lng: 75.695,
      at: new Date(),
    },
    initialPosition: {
      lat: 31.2455,
      lng: 75.695,
    },
    path: [
      { lat: 31.2455, lng: 75.695, at: new Date() },
      { lat: 31.2456, lng: 75.6951, at: new Date() },
    ],
    lastMovementAt: new Date(),
  },
  {
    busNumber: "PB-21",
    sessionId: uuidv4(),
    active: true,
    confidence: "LIVE",
    startedAt: new Date(),
    lastPingAt: new Date(),
    lastLocation: {
      lat: 31.2601,
      lng: 75.7102,
      at: new Date(),
    },
    initialPosition: {
      lat: 31.2601,
      lng: 75.7102,
    },
    path: [
      { lat: 31.2601, lng: 75.7102, at: new Date() },
      { lat: 31.2602, lng: 75.7103, at: new Date() },
    ],
    lastMovementAt: new Date(),
  },
]);


    console.log("📍 LiveSession for PB-12 seeded");

    console.log("🎉 Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();
