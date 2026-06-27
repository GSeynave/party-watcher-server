import { Server } from "socket.io";
import http from "http";
import { registerRoomHandlers } from "./RoomHandlers.js";
import { registerHeartbeatHandlers } from "./HeartbeatHandlers.js";
import { getUserId } from "../../../shared/security/TokenHelper.js";
import { config } from "../../../config.js";

let io: Server | null = null;
export function initSocketio(server: http.Server) {
  const clientHost = config.CLIENT_HOST! as string;
  io = new Server(server, {
    cors: {
      origin: clientHost,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);
    console.log("Websocket - Checking auth token for leaveRoom");
    console.log(
      "Websocket - Socket handshake headers:",
      socket.handshake.headers,
    );
    console.log(
      "UserId from token:",
      getUserId(socket.handshake.headers.cookie || ""),
    );

    registerRoomHandlers(io!, socket);
    registerHeartbeatHandlers(io!, socket);

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io server not initialized");
  }
  console.log("Returning Socket.io server instance");
  return io;
}
