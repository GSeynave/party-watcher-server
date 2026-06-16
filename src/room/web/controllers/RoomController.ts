import express from "express";
import type { Request, Response, NextFunction } from "express";
import type { OutputGetRooms } from "../dto/OutputGetRooms.js";
import { DtoMapper } from "../mapper/DtoMapper.js";
import { GetRoomUseCase } from "../../application/GetRoomUseCase.js";
import { CreateRoomUseCase } from "../../application/CreateRoomUseCase.js";
import { SendMessageUseCase } from "../../application/SendMessageUseCase.js";
import { JoinRoomUseCase } from "../../application/JoinRoomUseCase.js";
import { CreateRoomInput } from "../dto/InputCreateRoom.js";
import { UserRepository } from "../../../user/infra/persistence/repositories/UserRepository.js";
import { RoomRepository } from "../../infra/persistence/repositories/RoomRepository.js";

const router = express.Router();
const dtoMapper = new DtoMapper();
const roomRepository = new RoomRepository();
const userRepository = new UserRepository();
const getRoomUseCase = new GetRoomUseCase(roomRepository, userRepository);
const createRoomUseCase = new CreateRoomUseCase(roomRepository, userRepository);
const sendMessageUseCase = new SendMessageUseCase(
  roomRepository,
  userRepository,
);
const joinRoomUseCase = new JoinRoomUseCase(roomRepository, userRepository);

router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const rooms = await getRoomUseCase.getAllRooms();
  // turn this into a sto room list
  const output: OutputGetRooms = dtoMapper.toOutputGetRooms(rooms);
  res.status(200).send(output);
  return;
});

router.post("", async (req: Request, res: Response) => {
  // create a new room

  const userId = req.userId!;
  const createRoomDto = new CreateRoomInput(
    req.body.name,
    req.body.url,
    userId,
  );

  const room = await createRoomUseCase.createRoom(createRoomDto);

  res.status(201).send(room);
});

router.post("/:roomId/message", async (req: Request, res: Response) => {
  // create a new room

  if (req.params.roomId === undefined) {
    res.status(400).send({ error: "Room id is required" });
    return;
  }
  if (req.body.message === undefined) {
    res.status(400).send({ error: "Message is required" });
    return;
  }
  // save the room to the database and return the created room
  const userId = req.userId!;

  const room = await sendMessageUseCase.sendMessage(
    req.body.message,
    userId!,
    req.params.roomId.toString(),
  );

  res.status(201).send(room);
});

router.get("/:id", async (req: Request, res: Response) => {
  if (req.params.id === undefined) {
    res.status(400).send({ error: "Room id is required" });
    return;
  }
  // find the room from the database and add the user to the room
  const room = await getRoomUseCase.getRoomById(req.params.id.toString());
  if (!room) {
    res.status(404).send({ error: "Room not found" });
    return;
  }
  res.status(200).send(room);
});

router.get(
  "/:id/join",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    if (req.params.id === undefined) {
      res.status(400).send({ error: "Room id is required" });
      return;
    }
    // find the room from the database and add the user to the room
    // add user to the room in the database and return the updated room

    try {
      const room = await joinRoomUseCase.joinRoom(
        req.params.id.toString(),
        req.userId!,
      );
      res.status(200).send(room);
    } catch (error: any) {
      next(error);
    }
  },
);
export default router;
