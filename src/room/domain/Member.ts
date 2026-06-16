export class Member {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
  ) {}

  static create(id: string, name: string): Member {
    if (!id || !name) {
      throw new Error("All Member fields are required");
    }
    return new Member(id, name);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
