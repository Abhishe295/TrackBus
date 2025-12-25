import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema({
    busNumber: {
        type:String,
        required: true,
        unique: true,
    },
    sessionId:{
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    lastLocation: {
        lat: Number,
        lng: Number,
        at: Date,
    },
    lastPingAt: {
        type: Date,
        default: Date.now,
    },
    confidence: {
        type: String,
        enum: ["LIVE","DELAYED","OFFLINE"],
        default: "LIVE",
    },

    startedAt: {
        type: Date,
        default: Date.now,
    },

    lastContributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    initialPosition: {
        lat: Number,
        lng: Number,
    },
    path: [{
        lat: Number,
        lng: Number,
        at: Date,
    }],

    lastMovementAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps: true});

export default mongoose.model("LiveSession",liveSessionSchema);