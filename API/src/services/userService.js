import userRepository from "../repositories/userRepository.js"

class userService {
  async getUsers() {
    return await userRepository.getAll();
  }

  async createUser(data) {
    if (!data.email) {
      throw new Error("Email requerido");
    }

    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("El usuario ya existe");
    }

    return await userRepository.create(data);
  }
}

export default new userService();