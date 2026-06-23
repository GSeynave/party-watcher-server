import { RoomRepository } from "../infra/persistence/repositories/RoomRepository.js";
import { UserRepository } from "../../user/infra/persistence/repositories/UserRepository.js";
import type { CreateRoomInput } from "../web/dto/InputCreateRoom.js";
import { Room } from "../domain/Room.js";

export class CreateRoomUseCase {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createRoom(createRoomInput: CreateRoomInput): Promise<string> {
    var user = await this.userRepository.findById(createRoomInput.userId);
    if (!user) {
      throw new Error("User not found");
    }

    var room = Room.create(
      createRoomInput.name,
      createRoomInput.userId,
      createRoomInput.videoUrl,
    );
    room.addMember(createRoomInput.userId, user.username);
    return await this.roomRepository.createRoom(room);
  }
}
