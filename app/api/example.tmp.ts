import neo4j, { query } from "./src/drivers/neo4j";
import redis from "./src/drivers/redis";

interface User {
  name: string;
}

// Neo4j
//------------------------------------------
(async () => {
  let session = neo4j.session();

  let users = await query<User>(
    session,
    "Match (p:Person) return p.name as name"
  );
  users.forEach((user) => {
    console.log(user);
  });

  await session.close();
})();
//------------------------------------------

//Redis
//------------------------------------------
(async () => {
  let client = await redis.connect();

  await client.set("key", "value");
  let value = await client.get("key");

  console.log(value);

  await client.disconnect();
})();
//------------------------------------------
