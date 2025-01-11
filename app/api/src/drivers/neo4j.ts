import neo4j, { Driver, RecordShape, Session } from "neo4j-driver";

let driver: Driver = neo4j.driver("neo4j://localhost");

export async function query<T extends RecordShape>(
  session: Session,
  query: String
): Promise<T[]> {
  return (await session.run<T>(query)).records.map((record) =>
    record.toObject()
  );
}

export default driver;

let test = async () => {
  try {
    const serverInfo = await driver.getServerInfo();
    console.log("Connection to neo4j established");
    console.log(serverInfo);
  } catch (err: any) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  }
};
