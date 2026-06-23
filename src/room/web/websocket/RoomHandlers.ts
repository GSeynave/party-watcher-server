import type { Socket, Server } from "socket.io";
import { getUserId } from "../../../shared/security/TokenHelper.js";
import { LeaveRoomUseCase } from "../../application/LeaveRoomUseCase.js";
import { RoomRepository } from "../../infra/persistence/repositories/RoomRepository.js";
import { DeleteRoomUseCase } from "../../application/DeleteRoomUseCase.js";

export function registerRoomHandlers(io: Server, socket: Socket) {
  const roomRepository = new RoomRepository();
  const leaveRoomUseCase = new LeaveRoomUseCase(
    roomRepository,
    new DeleteRoomUseCase(roomRepository),
  );
  socket.on("joinRoom", (roomId: string) => {
    console.log(`Websocket - User joined room: ${roomId}`);

    //
    //if (!socket.handshake.headers.authorization) {
    //  console.log("Websocket - No auth token, disconnecting");
    //  socket.disconnect();
    //  return;
    //}

    socket.join(roomId);
    io.to(roomId).emit("userJoined", {
      message: `A new user has joined room ${roomId}`,
    });
  });

  socket.on("leaveRoom", async (roomId: string) => {
    console.log(`Websocket - User left room: ${roomId}`);
    // Get the token from the socket handshake headers, extract the user id, and remove the user from the room in the database
    console.log("Websocket - Checking auth token for leaveRoom");
    console.log(
      "Websocket - Socket handshake headers:",
      socket.handshake.headers,
    );
    const userId = getUserId(socket.handshake.headers.cookie || "");
    console.log("Websocket - Extracted userId from token:", userId);
    if (!userId) {
      console.log("Websocket - No userId found, disconnecting");
      socket.disconnect();
      return;
    }
    await leaveRoomUseCase.leaveRoom(userId, roomId);
    io.to(roomId).emit("userLeft", {
      message: `User ${userId},  has left room ${roomId}`,
    });
    socket.leave(roomId);
  });
}
