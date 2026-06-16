import { ObjectId } from "mongodb";
import { Room } from "../../domain/Room.js";
import { Member } from "../../domain/Member.js";
import { Message } from "../../domain/Message.js";
import type {
  MemberEntity,
  MessageEntity,
  RoomEntity,
} from "./entities/RoomEntity.js";

export class RoomEntityMapper {
  static toDomain(entity: RoomEntity): Room {
    return new Room(
      entity.name,
      entity.ownerId,
      entity.videoUrl,
      entity.members?.map((m: MemberEntity) =>
        Member.create(m.id.toString(), m.name),
      ),
      entity.messages?.map((msg: MessageEntity) =>
        Message.create(msg.id, msg.senderId, msg.content, msg.timestamp),
      ),
      entity._id?.toString(),
    );
  }

  static toEntity(room: Room): RoomEntity {
    return {
      _id: new ObjectId(room.id),
      name: room.name,
      videoUrl: room.videoUrl!,
      ownerId: room.ownerId,
      members: room.members.map((m) => ({
        id: new ObjectId(m.id),
        name: m.name,
      })),
      messages: room.messages.map((msg) => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        timestamp: msg.timestamp,
        sender: msg.sender!,
      })),
    };
  }
}
