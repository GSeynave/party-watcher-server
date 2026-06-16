import { HttpError } from "../../shared/errors/HttpError.js";
import { RoomRepository } from "../infra/persistence/repositories/RoomRepository.js";
import { UserRepository } from "../../user/infra/persistence/repositories/UserRepository.js";
import { Member } from "../domain/Member.js";

export class JoinRoomUseCase {
  constructor(
    private readonly roomRepo: RoomRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async joinRoom(roomId: string, userId: string) {
    // Will need to open a websocket connection here, once done, update the room with the new user(verify not present !)
    // When connection is lost : update the room to remove the user, and close the websocket connection
    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new HttpError(404, "Room not found");
    }

    var user = await this.userRepo.findById(userId);
    if (!user) {
      throw new HttpError(403, "Unauthorized");
    }

    const isUserAlreadyInRoom = room.members.some((member) => {
      return member.id.toString() === user?._id?.toString();
    });
    if (isUserAlreadyInRoom) {
      return;
    }

    room.members.push(Member.create(user._id!.toString(), user.username));
    await this.roomRepo.updateRoom(room.id!.toString(), room);
  }
}
