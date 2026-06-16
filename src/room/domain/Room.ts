import { Member } from "./Member.js";
import type { Message } from "./Message.js";

export class Room {
  public constructor(
    private readonly _name: string,
    private readonly _ownerId: string,
    private readonly _videoUrl?: string,
    private readonly _members: Member[] = [],
    private readonly _messages: Message[] = [],
    private readonly _id?: string,
  ) {}

  static create(name: string, ownerId: string, videoUrl?: string): Room {
    return new Room(name, ownerId, videoUrl);
  }

  public addMember(userId: string, userName: string) {
    if (this.members.some((m) => m.id === userId)) return;

    this.members.push(Member.create(userId, userName));
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get videoUrl(): string | undefined {
    return this._videoUrl;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get members(): Member[] {
    return this._members;
  }

  get messages(): Message[] {
    return this._messages;
  }
}
