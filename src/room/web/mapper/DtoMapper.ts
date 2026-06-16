import { Room } from "../../domain/Room.js";
import type { OutputGetRooms } from "../dto/OutputGetRooms.js";

export class DtoMapper {
  constructor() {}

  toOutputGetRooms(rooms: Room[]): OutputGetRooms {
    let outputRooms: any[] = rooms.map((room) => {
      return {
        id: room.id,
        name: room.name,
        videoUrl: room.videoUrl,
        memberCount: room.members?.length ?? 0,
      };
    });
    return { rooms: outputRooms };
  }
}
