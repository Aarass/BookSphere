import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { getSession, query } from "../drivers/neo4j";
import { User } from "@interfaces/user";
import { LoginDto } from "@interfaces/dtos/login";
import { RegisterDto } from "@interfaces/dtos/register";

async function login(data: LoginDto): Promise<User> {
  let { username, password } = data;
  let session = getSession();

  let result = await query<User>(
    session,
    `MATCH (n: User {username: $username}) return
      n.id as id,
      n.username as username,
      n.passhash as passhash,
      n.firstName as firstName,
      n.lastName as lastName`,
    { username }
  );

  if (result.length == 0) {
    return Promise.reject("There is no user with that username");
  } else if (result.length > 1) {
    console.error("Multiple users with same credentials!");
    throw "Internal error";
  }

  let [user] = result;

  let passwordMatches = await bcrypt.compare(password, user.passhash);
  if (!passwordMatches) {
    return Promise.reject("Wrong password");
  }

  session.close();
  return user;
}

async function register(data: RegisterDto) {
  let id = uuidv4();
  let passhash = await bcrypt.hash(data.password, 10);

  let session = getSession();
  await session.run(
    "CREATE (u:User {id: $id, username: $username, passhash: $passhash, firstName: $firstName, lastName: $lastName})",
    {
      id,
      passhash,
      ...data,
    }
  );
  session.close();
}

export default { login, register };
