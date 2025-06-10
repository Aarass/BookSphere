import { Db, MongoClient } from "mongodb";

const uri = "mongodb://root:rootpassword@mongo:27017";
const dbName = "my_database";

let client: MongoClient;
let db: Db;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();

  db = client.db(dbName);
  console.log("Connected to MongoDB");

  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase() first.");
  }
  return db;
}

export async function closeConnection() {
  await client.close();
  console.log("MongoDB connection closed");
}
