import ioClient from "socket.io-client";
const ENDPOINT = "http://localhost:4000";

const io = ioClient(ENDPOINT);

export const socket = io;