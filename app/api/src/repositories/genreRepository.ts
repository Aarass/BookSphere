import { getSession, query } from "../drivers/neo4j";
import { v4 as uuidv4 } from "uuid";
import { Genre } from "@interfaces/genre";

class GenreRepository {
  async create(name: string) {
    const session = getSession();
    try {
      const result = await query<Genre>(
        session,
        `CREATE (g:Genre {id: $id, name: $name}) return ${toGenre("g")}`,
        {
          id: uuidv4(),
          name,
        }
      );

      if (result.length != 1) {
        throw `Internal error`;
      }

      return result[0];
    } finally {
      await session.close();
    }
  }

  async getAll() {
    const session = getSession();
    try {
      const result = await query<Genre>(
        session,
        `MATCH (g:Genre) return ${toGenre("g")}`,
        {}
      );
      return result;
    } finally {
      await session.close();
    }
  }

  async getById(id: string) {
    const session = getSession();
    try {
      const result = await query<Genre>(
        session,
        `MATCH (g:Genre {id: $id}) RETURN ${toGenre("g")}`,
        {
          id,
        }
      );

      if (result.length === 0) {
        throw new Error(`Genre with id ${id} does not exist.`);
      }

      return result[0];
    } finally {
      await session.close();
    }
  }
}

export const genreRepository = new GenreRepository();

function toGenre(genreVar: string) {
  return `
    ${genreVar}.id as id,
    ${genreVar}.name as name
  `;
}

async function tests() {
  if (false) {
    const tmp = await genreRepository.create("nesto drugo");
    console.log(tmp);
  }

  if (false) {
    const tmp = await genreRepository.getAll();
    console.log(tmp);
  }
}

// (async () => {
//   await tests();
// })();
