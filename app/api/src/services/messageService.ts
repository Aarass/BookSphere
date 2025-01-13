import { CreateMessageDto, ReadMessagesDto } from "@interfaces/dtos/messageDto";
import { messageRepository } from "../repositories/messageRepository";
import { Message } from "@interfaces/message";
import { getClient } from "../drivers/redis";

async function sendMessage(data: CreateMessageDto, authorId: string) {
  let newMessage = await messageRepository.create(
    data.content,
    data.bookClubId,
    data.roomId,
    authorId
  );

  await messageRepository.publish(newMessage, data.bookClubId, data.roomId);
}

/**
 * @returns function to unsubscribe
 */
function subscribeToNewMessages(
  bookClubId: string,
  roomId: string,
  onNewMessage: (new_message: Message) => void
) {
  const redisClient = getClient();
  const redisChannel = `channels:msgs:${bookClubId}:${roomId}`;

  redisClient.subscribe(redisChannel, (value) => {
    const message = JSON.parse(value) as Message;
    onNewMessage(message);
  });

  return () => {
    redisClient.quit();
  };
}

async function getMessages(
  readMessagesDto: ReadMessagesDto,
  bookClubId: string,
  roomId: string
) {
  return await messageRepository.getBefore(
    readMessagesDto.beforeTimestamp,
    readMessagesDto.limit,
    bookClubId,
    roomId
  );
}

export default { sendMessage, getMessages, subscribeToNewMessages };
