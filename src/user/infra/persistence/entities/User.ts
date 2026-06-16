import type { ObjectId } from "mongodb";

export type User = {
  _id?: ObjectId;
  username: string;
  mail: string;
  password: string;
};
