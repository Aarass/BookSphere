import neo4j, { Driver, RecordShape, Session } from "neo4j-driver";

let driver: Driver = neo4j.driver("neo4j://localhost");

export async function query<T extends RecordShape>(
  session: Session,
  query: String,
  parameters: any
): Promise<T[]> {
  return (await session.run<T>(query, parameters)).records.map((record) =>
    record.toObject()
  );
}

/**
 * Acquire a session to communicate with the database.
 *
 * Make sure you always call close when you are done using a session!
 *
 * @returns new-session
 */
export function getSession() {
  return driver.session({ database: "neo4j" });
}

async () => {
  try {
    const serverInfo = await driver.getServerInfo();
    console.log("Connection to neo4j established");
    console.log(serverInfo);
  } catch (err: any) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  }
};
