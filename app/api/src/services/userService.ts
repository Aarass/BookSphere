import { userRepository } from "../repositories/userRepository";

async function getUser(id: string) {
  return await userRepository.getUserById(id);
}

export default {
  getUser,
};
