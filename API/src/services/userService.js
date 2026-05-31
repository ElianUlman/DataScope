import userRepository from "../repositories/userRepository.js"
import bcrypt from "bcrypt";
import { hashRounds, tokenWholePassword } from "../config.js"
import jwt from "jsonwebtoken";

import { validateFields, blockFields } from "../utils/validationUtils.js";
import redis from "../utils/redis.js";
import { sendEmail } from "../utils/mailer.js";

class userService {



  async createUser(data) {

    validateFields(['email', 'name', 'password'], data)
    blockFields(['creationdate'], data)

    const existing = await userRepository.findByEmail(data.email);

    if (existing) { throw new Error("User already exists") }

    data.allowed_ais = ["chatgpt", "claude", "gemini", "other"]
    data.enabled_mfa = false
    data.password = await bcrypt.hash(data.password, hashRounds);


    return await userRepository.create(data);
  }

  async login(data) {
    validateFields(['password', 'email'], data);

    const user = await userRepository.findByEmail(data.email);
    if (!user) { throw new Error("User does not exist"); }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new Error("wrong password");
    }

    if (user.enabled_mfa === true) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedCode = await bcrypt.hash(code, 10)
      await redis.set(`mfa:${user.id}`, hashedCode, { EX: 300 });
      console.log("sending email to "+ user.email)
      await sendEmail(user.email, code)

      const MFAtoken = jwt.sign(
        { id: user.id, isMFA: true },
        tokenWholePassword,
        { expiresIn: "1h" }
      );

      return { requiresMfa: true, token: MFAtoken };
    }

    const token = jwt.sign(
      { id: user.id, username: user.name, email: user.email, allowed_ais: user.allowed_ais },
      tokenWholePassword,
      { expiresIn: "1h" }
    );

    const expiresInMs = 60 * 60 * 1000;
    const expiresAt = Date.now() + expiresInMs;

    return { requiresMfa: false, token, expiresAt, user };
  }

  async MFA(data) {
    validateFields(['id', 'code'], data)

    const code = await redis.get(`mfa:${data.id}`)
    if (!(await bcrypt.compare(data.code, code))) { throw new Error("wrong code"); }

    const user = await userRepository.getById(data.id)

    const token = jwt.sign(
      { id: user.id, username: user.name, email: user.email, allowed_ais: user.allowed_ais },
      tokenWholePassword,
      { expiresIn: "1h" }
    );

    const expiresInMs = 60 * 60 * 1000;
    const expiresAt = Date.now() + expiresInMs;

    return { token, expiresAt, user };

  }

  async changeUserData(data, userId) {

    blockFields(['creationdate', 'id'], data)
    return await userRepository.update(userId, data)



  }

}

export default new userService();

