import {io} from "socket.io-client";

const socket = io(
    import.meta.env.VITE_BACKEND_URL || "http://localhost:7000",
    {
        transports: ["websocket"],
        withCredentials: true,
        autoConnect: false,
    }
);

export default socket;