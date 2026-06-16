import { ObjectId } from "mongodb";
import type { RoomEntity } from "../entities/RoomEntity.js";
import { getDb } from "../../../../shared/infra/MongoClient.js";
import { Room } from "../../../domain/Room.js";
import { RoomEntityMapper } from "../RoomEntityMapper.js";

export class RoomRepository {
  private collection() {
    return getDb().collection<RoomEntity>("rooms");
  }

  async findAll(): Promise<Room[]> {
    const result = await this.collection().find().toArray();
    const rooms: Room[] = [];
    result.forEach((room) => {
      rooms.push(RoomEntityMapper.toDomain(room));
    });

    return rooms;
  }

  async createRoom(room: Room): Promise<string> {
    const result = await this.collection().insertOne(
      RoomEntityMapper.toEntity(room),
    );
    return result.insertedId.toString();
  }

  async findById(id: string): Promise<Room | null> {
    const result = await this.collection().findOne({
      _id: new ObjectId(id),
    });
    if (!result) return null;

    return RoomEntityMapper.toDomain(result);
  }

  async updateRoom(id: string, room: Room): Promise<void> {
    await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: RoomEntityMapper.toEntity(room) },
    );
  }

  async deleteRoom(id: string): Promise<void> {
    await this.collection().deleteOne({ _id: new ObjectId(id) });
  }
}
