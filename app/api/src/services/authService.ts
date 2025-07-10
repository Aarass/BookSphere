import bcrypt from "bcrypt";
import { User } from "@interfaces/user";
import { LoginDto } from "@interfaces/dtos/loginDto";
import { RegisterDto } from "@interfaces/dtos/registerDto";
import { userRepository } from "../repositories/userRepository";

// TODO ne vracati password hash

async function login(data: LoginDto): Promise<User> {
  let { username, password } = data;

  let user = await userRepository.getUserByUsername(username);
  if (!user) {
    return Promise.reject("There is no user with that username");
  }

  let passwordMatches = await bcrypt.compare(password, user.passhash);
  if (!passwordMatches) {
    return Promise.reject("Wrong password");
  }

  return user;
}

async function register(data: RegisterDto) {
  let existing_user = await userRepository.getUserByUsername(data.username);
  if (existing_user) {
    return Promise.reject("Username taken");
  }

  try {
    return await userRepository.createUser(
      data.username,
      data.password,
      data.firstName,
      data.lastName,
      data.color,
    );
  } catch (err) {
    console.log(err);
    return Promise.reject("Couldn't create user");
  }
}

export default { login, register };
