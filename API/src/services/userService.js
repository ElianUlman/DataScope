import userRepository from "../repositories/userRepository.js"
import bcrypt from "bcrypt";
import {hashRounds, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";

class userService {
  

  async createUser(data) {
    const requiredFields = ['email', 'name', 'password'];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }


    const existing = await userRepository.findByEmail(data.email);

    if (existing) {throw new Error("User already exists")}

    data.password = await bcrypt.hash(data.password, hashRounds);
    return await userRepository.create(data);
  }

  async login(data) {
    if (!data.email) {throw new Error("Email needed");}
    if (!data.password) {throw new Error("Password needed");}


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
    if(!data.id){throw new Error("missing user id")}
    return await userRepository.getById(data.id)
  }
}

export default new userService();

