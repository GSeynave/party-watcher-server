import { HttpError } from "../../shared/errors/HttpError.js";
import { RoomRepository } from "../infra/persistence/repositories/RoomRepository.js";
import { DeleteRoomUseCase } from "./DeleteRoomUseCase.js";

export class LeaveRoomUseCase {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
  ) {}

  async leaveRoom(userId: string, roomId: string) {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw new HttpError(404, "Room not found");
    }
    if (!room.members) {
      return;
    }

    const userIndex = room.members?.findIndex((member) => {
      return member?.id?.toString() === userId;
    });
    if (userIndex === -1) {
      throw new HttpError(404, "User not found in room");
    }

    room.members?.splice(userIndex, 1);
    await this.roomRepository.updateRoom(room.id!.toString(), room);
    if (room.members?.length === 0) {
      this.deleteRoomUseCase.deleteRoom(roomId);
    }
  }
}
