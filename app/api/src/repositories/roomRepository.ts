import { v4 as uuidv4 } from "uuid";
import { getSession, query } from "../drivers/neo4j";
import { Room } from "@interfaces/room";

class RoomRepository {
  async create(tittle: string, description: string) {
    let session = getSession();

    let result = await query<Room>(
      session,
      `CREATE (n:Room {
        id: $id,
        tittle: $tittle,
        description: $description
      })
      return ${toRoom("n")}`,
      {
        id: uuidv4(),
        tittle,
        description,
      },
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
      { bookClubId },
    );

    await session.close();
    return result;
  }

  async getRoomById(bookClubId: string, roomId: string) {
    let session = getSession();

    let result = await query<Room>(
      session,
      `Match (n:BookClub {id: $bookClubId})-[:OWNS]->(r:Room {id: $roomId})
       return ${toRoom("r")}`,
      { bookClubId, roomId },
    );

    if (result.length === 0) {
      return null;
    }

    if (result.length > 1) {
      throw "Internal error";
    }

    await session.close();
    return result[0];
  }
}

export const roomRepository = new RoomRepository();

function toRoom(roomVar: string) {
  return `
    ${roomVar}.id as id,
    ${roomVar}.tittle as tittle,
    ${roomVar}.description as description
  `;
}
