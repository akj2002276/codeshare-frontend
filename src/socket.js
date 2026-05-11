import { io } from "socket.io-client";

const socket = io(
  "https://codeshare-backend-t6dh.onrender.com"
);

export default socket;