import { BookClub, BookClubWithMembershipStatus } from "@interfaces/bookClub";
import { getSession, query } from "../drivers/neo4j";
import { v4 as uuidv4 } from "uuid";

class BookClubRepository {
  async create(title: string, description: string) {
    let session = getSession();

    let result = await query<BookClub>(
      session,
      `CREATE (n:BookClub {
        id: $id,
        title: $title,
        description: $description
      })
      return ${toBookClub("n")}`,
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

  async getAll(userId: string | null) {
    let session = getSession();
    let result = await query<BookClubWithMembershipStatus>(
      session,
      `MATCH (b:BookClub)
        OPTIONAL MATCH (:User {id: $userId})-[r:IS_MEMBER_OF]->(b) return ${toBookClub("b")},
        CASE WHEN r IS NOT NULL THEN true ELSE false END AS isJoined`,
      {
        userId,
      }
    );

    await session.close();
    return result;
  }

  async getJoined(userId: string) {
    let session = getSession();
    let result = await query<BookClub>(
      session,
      `MATCH (:User {id: $userId})-[:IS_MEMBER_OF]->(n:BookClub) return ${toBookClub("n")}`,
      {
        userId,
      }
    );
    await session.close();

    return result;
  }

  async join(bookClubId: string, userId: string) {
    let session = getSession();
    // TODO _maybe_
    // Maybe we should check if relations is already there.
    // This way, duplicate relation could be created, but it's not a big deal

    let result = await session.run(
      `MATCH (user:User {id: $userId}), (bookClub:BookClub {id: $bookClubId})
       CREATE (user)-[:IS_MEMBER_OF]->(bookClub)`,
      {
        userId,
        bookClubId,
      }
    );

    let createdCount = result.summary.counters.updates().relationshipsCreated;
    if (createdCount == 0) {
      return Promise.reject("No relations created");
    }

    await session.close();
  }

  async leave(bookClubId: string, userId: string) {
    let session = getSession();

    let result = await session.run(
      `MATCH (:User {id: $userId})-[r:IS_MEMBER_OF]->(:BookClub {id: $bookClubId}) DELETE r`,
      {
        userId,
        bookClubId,
      }
    );

    let deletedCount = result.summary.counters.updates().relationshipsDeleted;
    if (deletedCount == 0) {
      return Promise.reject("No relations deleted");
    }

    await session.close();
  }

  async takeOwnershipOfRoom(bookClubId: string, roomId: string) {
    let session = getSession();

    let result = await session.run(
      `MATCH (bookClub:BookClub {id: $bookClubId}), (room:Room {id: $roomId})
       CREATE (bookClub)-[:OWNS]->(room)`,
      {
        bookClubId,
        roomId,
      }
    );

    let createdCount = result.summary.counters.updates().relationshipsCreated;
    if (createdCount == 0) {
      return Promise.reject("No relations created");
    }

    await session.close();
  }
}

export const bookClubRepository = new BookClubRepository();

function toBookClub(bookClubVar: string) {
  return `
    ${bookClubVar}.id as id,
    ${bookClubVar}.title as title,
    ${bookClubVar}.description as description
  `;
}
