import { RoomRepository } from "../infra/persistence/repositories/RoomRepository.js";

export class DeleteRoomUseCase {
  constructor(private readonly roomRepo: RoomRepository) {}
  async deleteRoom(roomId: string) {
    setTimeout(async () => {
      const room = await this.roomRepo.findById(roomId);
      if (!room || room?.members?.length > 0) {
        return;
      }
      this.roomRepo.deleteRoom(roomId);
    }, 60 * 1000); // delete the room after 1 minute, if no one has joined
  }
}
