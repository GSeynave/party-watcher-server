import { HttpError } from "../../shared/errors/HttpError.js";
import { RoomRepository } from "../infra/persistence/repositories/RoomRepository.js";
import { UserRepository } from "../../user/infra/persistence/repositories/UserRepository.js";
import { getIO } from "../web/websocket/index.js";
import { Message } from "../domain/Message.js";

export class SendMessageUseCase {
  constructor(
    private readonly roomRepo: RoomRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async sendMessage(messageValue: string, userId: string, roomId: string) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new HttpError(404, "Room not found");
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new HttpError(403, "Unauthorized");
    }

    var message: Message = Message.create(
      crypto.randomUUID(),
      userId,
      messageValue,
      Date.now(),
    );

    room.messages.push(message);
    await this.roomRepo.updateRoom(room.id!.toString(), room);
    getIO().to(roomId).emit("newMessage", {
      sender: user.mail,
      content: messageValue,
      timestamp: message.timestamp,
    });
  }
}
