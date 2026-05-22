import userRepository from "../repositories/userRepository.js"
import bcrypt from "bcrypt";
import { hashRounds, tokenWholePassword } from "../config.js"
import jwt from "jsonwebtoken";

import { validateFields, blockFields } from "../utils/validationUtils.js";

class userService {


  async createUser(data) {

    validateFields(['email', 'name', 'password'], data)
    blockFields(['creationdate'], data)

    const existing = await userRepository.findByEmail(data.email);

    if (existing) { throw new Error("User already exists") }

    data.allowed_ais = ["chatgpt", "claude", "gemini", "other"]
    data.password = await bcrypt.hash(data.password, hashRounds);

    return await userRepository.create(data);
  }

  async login(data) {
    validateFields(['password', 'email'], data)

    const user = await userRepository.findByEmail(data.email);
    if (!user) { throw new Error("User does not exist") }

    if (!(await bcrypt.compare(data.password, user.password))) { throw new Error("wrong password") }

    const token = jwt.sign(
      { id: user.id, username: user.name, email: user.email, allowed_ais: user.allowed_ais },
      tokenWholePassword,
      { expiresIn: "1h" }
    );

    // NUEVO: Retornamos ambas cosas desde el servicio hacia el controlador
    return { token, user };
  }

  async changeUserData(data, userId) {

    blockFields(['creationdate', 'id'], data)
    return await userRepository.update(userId, data)



  }

}

export default new userService();

