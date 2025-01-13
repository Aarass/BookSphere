import { query, getSession as getNeo4jSession } from "./src/drivers/neo4j";
import { getClient as getRedisClient } from "./src/drivers/redis";

import { User } from "@interfaces/user";

(async () => {
  let session = getNeo4jSession();

  let users = await query<User>(
    session,
    "Match (p:Person) return p.name as name",
    {}
  );
  users.forEach((user) => {
    console.log(user);
  });

  await session.close();
})();

(async () => {
  let client = getRedisClient();

  await client.set("key", "value");
  let value = await client.get("key");

  console.log(value);

  await client.disconnect();
})();

// TODO
// app.use(sessionMiddleware);
// io.use((socket, next) => {
//   /** @ts-ignore */
//   sessionMiddleware(socket.request, socket.request.res || {}, next);
//   // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
//   // connections, as 'socket.request.res' will be undefined in that case
// });
