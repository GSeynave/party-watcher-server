import { HttpError } from "../../shared/errors/HttpError.js";
import { RoomRepository } from "../infra/persistence/repositories/RoomRepository.js";
import { UserRepository } from "../../user/infra/persistence/repositories/UserRepository.js";

export class GetRoomUseCase {
  constructor(
    private readonly roomRepo: RoomRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async getAllRooms() {
    return await this.roomRepo.findAll();
  }

  async getRoomById(id: string) {
    const room = await this.roomRepo.findById(id.toString());
    if (!room) {
      throw new HttpError(404, "Room not found");
    }

    await Promise.all(
      room.messages?.map(async (message) => {
        const sender = await this.userRepo.findById(message.senderId);
        message.resolveSender(sender?.username ?? "Unknown");
      }) ?? [],
    );
    return {
      id: room.id,
      name: room.name,
      videoUrl: room.videoUrl,
      members: room.members?.map((member) => member.name) ?? [],
      messages:
        room.messages?.map((message) => ({
          sender: message.sender ?? "Unknown",
          content: message.content,
          timestamp: message.timestamp,
        })) ?? [],
    };
  }
}
