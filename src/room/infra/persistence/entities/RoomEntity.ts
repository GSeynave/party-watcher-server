import type { ObjectId } from "mongodb";

export type MemberEntity = {
  id: ObjectId;
  name: string;
};
export type MessageEntity = {
  id: string;
  senderId: string;
  sender?: string;
  content: string;
  timestamp: number;
};
export type RoomEntity = {
  _id?: ObjectId;
  name: string;
  videoUrl?: string;
  members: MemberEntity[];
  ownerId: string;
  messages?: MessageEntity[];
};
