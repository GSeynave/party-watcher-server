export class CreateRoomInput {
  private _name: string;
  private _videoUrl: string;
  private _userId: string;

  constructor(roomName: string, videoUrl: string, userId: string) {
    this.validateInput(roomName, videoUrl, userId);

    this._name = roomName;
    this._videoUrl = videoUrl;
    this._userId = userId;
  }

  validateInput(roomName: string, videoUrl: string, userId: string) {
    if (!roomName || roomName.trim() === "") {
      throw new Error("Room name is required");
    }
    if (!videoUrl || videoUrl.trim() === "") {
      throw new Error("Video URL is required");
    }
    if (!userId || userId.trim() === "") {
      throw new Error("User ID is required");
    }
  }

  get name(): string {
    return this._name;
  }

  get videoUrl(): string {
    return this._videoUrl;
  }

  get userId(): string {
    return this._userId;
  }
}
