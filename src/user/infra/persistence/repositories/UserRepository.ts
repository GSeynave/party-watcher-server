import { ObjectId } from "mongodb";
import type { User } from "../entities/User.js";
import { getDb } from "../../../../shared/infra/MongoClient.js";

export class UserRepository {
  private collection() {
    return getDb().collection<User>("users");
  }

  async createUser(user: User): Promise<ObjectId> {
    const result = await this.collection().insertOne(user);
    return result.insertedId;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.collection().findOne({ username: username });
    return result;
  }
  async findByMail(mail: string): Promise<User | null> {
    const result = await this.collection().findOne({ mail: mail });
    return result;
  }

  async findById(id: string): Promise<User | null> {
    console.log("Finding user by id " + id);
    const result = await this.collection().findOne({ _id: new ObjectId(id) });
    return result;
  }
}
