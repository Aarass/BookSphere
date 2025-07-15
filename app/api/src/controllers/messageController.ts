import { Request } from "express";
import { Socket } from "socket.io";
import messageService from "../services/messageService";

export function socketListener(socket: Socket) {
  const session = (socket.request as Request).session;
  const query = socket.handshake.query;

  const userId = session.data?.userId;
  const bookClubId = query["bookClubId"];
  const roomId = query["roomId"];

  if (!userId || typeof bookClubId != "string" || typeof roomId != "string") {
    socket.disconnect(true);
    return console.error("Connection data missing");
  }

  // TODO Permission check
  // Can user read/send messages from/to this room?

  const unsubscribe = messageService.subscribeToNewMessages(
    bookClubId,
    roomId,
    (newMessage) => {
      socket.send(newMessage);
    },
  );
  socket.on("disconnect", unsubscribe);

  socket.on("message", (content: string) => {
    if (typeof content != "string") {
      socket.send(new Error("Unsupported message type"));
      return;
    }

    messageService.sendMessage(
      {
        bookClubId,
        roomId,
        content,
      },
      userId,
    );
  });
}
