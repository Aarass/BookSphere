import { getSession, query } from "../drivers/neo4j";
import { v4 as uuidv4 } from "uuid";
import { Author } from "@interfaces/author";

class AuthorRepository {
  async create(fullName: string) {
    const session = getSession();
    try {
      const result = await query<Author>(
        session,
        `CREATE (a:Author {id: $id, fullName: $fullName}) RETURN ${toAuthor("a")}`,
        {
          id: uuidv4(),
          fullName,
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
      const result = await query<Author>(
        session,
        `MATCH (a:Author) RETURN ${toAuthor("a")}`,
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
      const result = await query<Author>(
        session,
        `MATCH (a:Author {id: $id}) RETURN ${toAuthor("a")}`,
        {
          id,
        }
      );

      if (result.length === 0) {
        throw new Error(`Author with id ${id} does not exist.`);
      }

      return result[0];
    } finally {
      await session.close();
    }
  }
}

export const authorRepository = new AuthorRepository();

function toAuthor(authorVar: string) {
  return `
    ${authorVar}.id as id,
    ${authorVar}.fullName as fullName
  `;
}

async function tests() {
  if (false) {
    const tmp = await authorRepository.create("ser Aleksandar Prokopovic");
    console.log(tmp);
  }

  if (false) {
    const tmp = await authorRepository.getAll();
    console.log(tmp);
  }
}

// (async () => {
//   await tests();
// })();
