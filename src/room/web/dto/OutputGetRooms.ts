type Room = {
  id: string;
  name: string;
  videoUrl: string;
  memberCount: number;
};

export type OutputGetRooms = {
  rooms: Room[];
};
