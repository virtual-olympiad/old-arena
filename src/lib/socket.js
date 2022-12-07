import ioClient from "socket.io-client";
const ENDPOINT = import.meta.env.VITE_NODE_ENV == "development" ? "http://localhost:4000" : import.meta.env.VITE_SERVER_ENDPOINT;
const io = ioClient(ENDPOINT);
export const socket = io;
//# sourceMappingURL=socket.js.map