import userRepository from "../repositories/userRepository.js"
import bcrypt from "bcrypt";
import {hashRounds, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

import { validateFields } from "../utils/validationUtils.js";

class userService {
  

  async createUser(data) {

    validateFields(['email', 'name', 'password'], data)

    const existing = await userRepository.findByEmail(data.email);

    if (existing) {throw new Error("User already exists")}

    data.allowed_ais = ["chatgpt","claude","gemini","other"]
    data.password = await bcrypt.hash(data.password, hashRounds);
    
    return await userRepository.create(data);
  }

  async login(data) {

    validateFields(['password', 'email'], data)

    const user = await userRepository.findByEmail(data.email);
    if(!user){throw new Error("User does not exist")}

    if(!(await bcrypt.compare(data.password, user.password))){throw new Error("wrong password")}

    return jwt.sign(
        { id: user.id, username: user.name},
        tokenWholePassword,
        { expiresIn: "1h" }
    );
  }

  //?
  async getUserData(data){
    validateFields(['id'], data)
    
    return await userRepository.getById(data.id)
  }
}

export default new userService();

