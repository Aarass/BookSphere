import { v4 as uuidv4 } from "uuid";
import { getSession, query } from "../drivers/neo4j";
import { Room } from "@interfaces/room";

class RoomRepository {
  async create(title: string, description: string) {
    let session = getSession();

    let result = await query<Room>(
      session,
      `CREATE (n:Room {
        id: $id,
        title: $title,
        description: $description
      })
      return ${toRoom("n")}`,
      {
        id: uuidv4(),
        title,
        description,
      }
    );

    await session.close();

    if (result.length != 1) {
      throw "Internal error";
    }

    return result[0];
  }

  async getAllInBookClub(bookClubId: string) {
    let session = getSession();

    let result = await query<Room>(
      session,
      `Match (n:BookClub {id: $bookClubId})-[:OWNS]->(r:Room)
       return ${toRoom("r")}`,
      { bookClubId }
    );

    await session.close();
    return result;
  }
}

export const roomRepository = new RoomRepository();

function toRoom(roomVar: string) {
  return `
    ${roomVar}.id as id,
    ${roomVar}.title as title,
    ${roomVar}.description as description
  `;
}
