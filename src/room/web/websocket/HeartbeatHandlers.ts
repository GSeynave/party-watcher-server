import type { Socket, Server } from "socket.io";

export function registerHeartbeatHandlers(io: Server, socket: Socket) {
  socket.on("heartbeat", (data: { roomId: string }) => {
    console.log(`Websocket - heartbeat for room: ${data.roomId}`);
    socket.emit("heartbeatAck", {
      message: `Heartbeat ack on room ${data.roomId}`,
    });
  });
}
