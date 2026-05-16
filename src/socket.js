import { io } from "socket.io-client";

const socket = io(
  "https://codeshare-backend-t6dh.onrender.com"
);

export default socket;

// import { io } from "socket.io-client";

// const socket = io("http://localhost:8000");

// export default socket;