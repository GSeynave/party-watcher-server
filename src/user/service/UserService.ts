import type { User } from "../infra/persistence/entities/User.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { UserRepository } from "../infra/persistence/repositories/UserRepository.js";
import bcrypt from "bcryptjs";

const userRepo = new UserRepository();

export class UserService {
  async login(mail: string, password: string) {
    const user = await userRepo.findByMail(mail);
    if (!user) {
      throw new HttpError(403, "Unauthorized: Invalid email");
    }

    var isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(403, "Unauthorized: Invalid password");
    }
    return user;
  }

  async register(mail: string, username: string, password: string) {
    var user = await userRepo.findByUsername(username);
    if (user) {
      throw new HttpError(400, "Username already exists");
    }
    var user = await userRepo.findByMail(mail);
    if (user) {
      throw new HttpError(400, "User mail already exists");
    }

    var salt = bcrypt.genSaltSync(10);
    var userEntity: User = {
      username: username,
      mail: mail,
      password: bcrypt.hashSync(password, salt),
    };
    await userRepo.createUser(userEntity);
  }

  async getUserById(id: string) {
    const user = await userRepo.findById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }
}
