import express from "express";
import type { Request, Response, NextFunction } from "express";
import {
  createToken,
  getExpirationTime,
} from "../../../shared/security/TokenHelper.js";
import { UserService } from "../../../user/service/UserService.js";

const userService = new UserService();
const router = express.Router();

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    // Body required : email / password

    const user = await userService.login(req.body.username, req.body.password);

    const token = createToken(user._id!.toString(), user.mail);

    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: getExpirationTime(),
      path: "/",
    });

    const responseBody = {
      userId: user._id,
      mail: req.body.mail,
    };

    res.status(200).send(responseBody);
    return;
  },
);

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    req.body;

    await userService.register(
      req.body.mail,
      req.body.username,
      req.body.password,
    );
  },
);

export default router;
