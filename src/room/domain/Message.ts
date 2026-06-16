export class Message {
  private constructor(
    private readonly _id: string,
    private readonly _senderId: string,
    private readonly _content: string,
    private readonly _timestamp: number,
    private _sender?: string,
  ) {}

  static create(
    id: string,
    senderId: string,
    content: string,
    timestamp: number,
    sender?: string,
  ): Message {
    if (!id || !senderId || !content || !timestamp) {
      throw new Error("All fields except sender are required");
    }
    if (content.length > 200) {
      throw new Error("Content exceeds maximum length of 200 characters");
    }
    return new Message(id, senderId, content, timestamp, sender);
  }

  public resolveSender(sender: string) {
    this._sender = sender;
  }

  get id(): string {
    return this._id;
  }

  get senderId(): string {
    return this._senderId;
  }

  get content(): string {
    return this._content;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  get sender(): string | undefined {
    return this._sender;
  }
}
