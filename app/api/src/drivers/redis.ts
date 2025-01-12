import { createClient } from "redis";

let client = createClient();

export function getClient() {
  let new_client = client.duplicate();
  new_client.connect().catch(console.error);

  return new_client;
}
