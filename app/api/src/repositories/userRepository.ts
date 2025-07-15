import { User } from "@interfaces/user";
import { getSession, query } from "../drivers/neo4j";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

class UserRepository {
  async getUserById(id: string): Promise<User | null> {
    let session = getSession();

    let result = await query<User>(
      session,
      `MATCH (n: User {id: $id}) return ${toUser("n")}`,
      { id },
    );

    await session.close();

    if (result.length == 0) {
      return null;
    } else if (result.length > 1) {
      console.error("Multiple users with same credentials!");
      throw "Internal error";
    }

    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | null> {
    let session = getSession();

    let result = await query<User>(
      session,
      `MATCH (n: User {username: $username}) return ${toUser("n")}`,
      { username },
    );

    await session.close();

    if (result.length == 0) {
      return null;
    } else if (result.length > 1) {
      console.error("Multiple users with same credentials!");
      throw "Internal error";
    }

    return result[0];
  }

  async createUser(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    color: string,
  ): Promise<User> {
    let passhash = await bcrypt.hash(password, 10);
    let session = getSession();

    let result = await query<User>(
      session,
      `CREATE (n:User {id: $id, username: $username, passhash: $passhash, firstName: $firstName, lastName: $lastName, color :$color}) return ${toUser("n")}`,
      {
        id: uuidv4(),
        username,
        passhash,
        firstName,
        lastName,
        color,
      },
    );
    await session.close();

    if (result.length != 1) {
      throw "Internal error";
    }

    return result[0];
  }
}

export const userRepository = new UserRepository();

function toUser(userVar: string) {
  return `
    ${userVar}.id as id,
    ${userVar}.username as username,
    ${userVar}.passhash as passhash,
    ${userVar}.firstName as firstName,
    ${userVar}.lastName as lastName,
    ${userVar}.color as color
  `;
}
