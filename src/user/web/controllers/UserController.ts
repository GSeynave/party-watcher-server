import express from "express";
import type { Request, Response, NextFunction } from "express";
import { UserService } from "../../service/UserService.js";

const userService = new UserService();
const router = express.Router();

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.getUserById(req.userId!);
  if (!user) {
    console.error("User not found for userId: " + req.userId);
    res.status(404).send({ error: "User not found" });
    return;
  }
  return res.status(200).send({
    userId: user._id,
    mail: user.mail,
    username: user.username,
  });
});

export default router;
