import { Message } from "@interfaces/message";
import { getClient } from "../drivers/redis";
import { v4 as uuidv4 } from "uuid";

class MessageRepository {
  async create(
    content: string,
    bookClubId: string,
    roomId: string,
    authorId: string
  ) {
    const client = getClient();

    const bucketKey = `msgs:${bookClubId}:${roomId}`;
    const timestamp = Date.now();

    const message: Message = {
      id: uuidv4(),
      body: content,
      authorId,
      timestamp,
    };

    await client.zAdd(bucketKey, {
      score: timestamp,
      value: JSON.stringify(message),
    });
    await client.quit();

    return message;
  }

  async publish(message: Message, bookClubId: string, roomId: string) {
    const client = getClient();

    const channel = `channels:msgs:${bookClubId}:${roomId}`;
    await client.publish(channel, JSON.stringify(message));

    await client.quit();
  }

  async getBefore(
    beforeTimestamp: number,
    limit: number,
    bookClubId: string,
    roomId: string
  ) {
    const client = getClient();
    const key = `msgs:${bookClubId}:${roomId}`;

    const result = (
      await client.zRange(key, beforeTimestamp, "-inf", {
        LIMIT: {
          offset: 0,
          count: limit,
        },
        BY: "SCORE",
        REV: true,
      })
    ).map((s) => JSON.parse(s));

    client.quit();
    return result;
  }
}

export const messageRepository = new MessageRepository();
