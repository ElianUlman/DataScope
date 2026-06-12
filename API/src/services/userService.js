import userRepository from "../repositories/userRepository.js"
import bcrypt from "bcrypt";
import { hashRounds, tokenWholePassword } from "../config.js"
import jwt from "jsonwebtoken";

import { supabase } from "../db.js";
import { upload } from "../utils/filesHandler.js";

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
    validateFields(['password', 'email'], data);

    const user = await userRepository.findByEmail(data.email);
    if (!user) { throw new Error("User does not exist"); }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new Error("wrong password");
    }

    return generateTokenResponse(user)
  }

  async changeUserData(data, userId) {

    blockFields(['creationdate', 'id'], data)
    try {
      const user = await userRepository.update(userId, data)


      return generateTokenResponse(user)

    } catch (error) {
      throw error
    }





  }



  async uploadProfilePicture(user, file) {
    // delete previous avatar if it exists
    if (user.profile_pic) {
      await supabase.storage
        .from("profilePic")
        .remove([user.profile_pic]);
    }

    const profile_pic = `${user.id}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("profilePic")
      .upload(
        profile_pic,
        file.buffer,
        {
          contentType: file.mimetype
        }
      );

    if (error) {
      throw new Error(error.message);
    }

    await userRepository.update(
      user.id,
      profile_pic
    );

    const {
      data: { publicUrl }
    } = supabase.storage
      .from("profilePic")
      .getPublicUrl(profile_pic);

    user.profile_pic = profile_pic;

    return generateTokenResponse(user)

  }

}

const generateTokenResponse = (user) => {
    const token = jwt.sign(
      { id: user.id, username: user.name, email: user.email, allowed_ais: user.allowed_ais, profile_pic: user.profile_pic },
      tokenWholePassword,
      { expiresIn: "1h" }
    );

    const expiresInMs = 60 * 60 * 1000;
    const expiresAt = Date.now() + expiresInMs;

    return { token, expiresAt, user };
  }

export default new userService();

