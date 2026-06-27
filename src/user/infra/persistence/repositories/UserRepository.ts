import { ObjectId } from "mongodb";
import type { User } from "../entities/User.js";
import { getDb } from "../../../../shared/infra/MongoClient.js";

export class UserRepository {
  private async collection() {
    const db = await getDb();
    return db.collection<User>("users");
  }

  async createUser(user: User): Promise<ObjectId> {
    const collection = await this.collection();
    const result = await collection.insertOne(user);
    return result.insertedId;
  }

  async findByUsername(username: string): Promise<User | null> {
    const collection = await this.collection();
    const result = await collection.findOne({ username: username });
    return result;
  }
  async findByMail(mail: string): Promise<User | null> {
    const collection = await this.collection();
    const result = await collection.findOne({ mail: mail });
    return result;
  }

  async findById(id: string): Promise<User | null> {
    const collection = await this.collection();
    const result = await collection.findOne({ _id: new ObjectId(id) });
    return result;
  }
}
