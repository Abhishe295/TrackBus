import {io} from "socket.io-client";

const socket = io(
    import.meta.env.VITE_BACKEND_URL || "http://localhost:7000",
    {
        withCredentials: true,
        autoConnect: false,
    }
);

export default socket;