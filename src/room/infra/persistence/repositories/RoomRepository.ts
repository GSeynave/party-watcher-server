import { ObjectId } from "mongodb";
import type { RoomEntity } from "../entities/RoomEntity.js";
import { getDb } from "../../../../shared/infra/MongoClient.js";
import { Room } from "../../../domain/Room.js";
import { RoomEntityMapper } from "../RoomEntityMapper.js";

export class RoomRepository {
  private async collection() {
    const db = await getDb();
    return db.collection<RoomEntity>("rooms");
  }
  async findAll(): Promise<Room[]> {
    const collection = await this.collection();
    const result = await collection.find().toArray();
    return result.map((room) => RoomEntityMapper.toDomain(room));
  }

  async createRoom(room: Room): Promise<string> {
    const collection = await this.collection();
    const result = await collection.insertOne(RoomEntityMapper.toEntity(room));
    return result.insertedId.toString();
  }

  async findById(id: string): Promise<Room | null> {
    const collection = await this.collection();
    const result = await collection.findOne({
      _id: new ObjectId(id),
    });
    if (!result) return null;

    return RoomEntityMapper.toDomain(result);
  }

  async updateRoom(id: string, room: Room): Promise<void> {
    const collection = await this.collection();
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: RoomEntityMapper.toEntity(room) },
    );
  }

  async deleteRoom(id: string): Promise<void> {
    const collection = await this.collection();
    await collection.deleteOne({ _id: new ObjectId(id) });
  }
}
