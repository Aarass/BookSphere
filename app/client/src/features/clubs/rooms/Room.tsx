import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, MessagesSquare, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useGetMessagesQuery, useGetRoomByIdQuery } from "./roomsApi";
import { useGetBookClubByIdQuery, useSendMessage } from "../bookClubsApi";
import { Separator } from "@/components/ui/separator";
import { BookClub } from "@interfaces/bookClub";
import { Room as RoomType } from "@interfaces/room";
import { useMemo } from "react";
import { Message } from "@interfaces/message";
import { useGetMeQuery, useGetUserQuery } from "@/features/user/userApi";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { isDark, tint, useMyColor } from "@/utils/colors";

export function Room() {
  let { id: clubId, roomId } = useParams();
  if (!clubId || !roomId) throw "Developer error";

  const { data: club, isLoading: clubLoading } =
    useGetBookClubByIdQuery(clubId);
  const { data: room, isLoading: roomLoading } = useGetRoomByIdQuery({
    clubId,
    roomId,
  });

  const { register, handleSubmit, watch, resetField } = useForm();
  const newMessage = watch("message");

  const sendMessage = useSendMessage({ bookClubId: clubId, roomId: roomId });

  function sendNewMessage() {
    sendMessage(newMessage);
    resetField("message");
  }

  const isLoading = clubLoading || roomLoading;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!club) {
    return <p>Couldn't fetch information about the club</p>;
  }

  if (!room) {
    return <p>Couldn't fetch information about the room</p>;
  }

  if (!club.isJoined) {
    return <p>You can't be here</p>;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden p-4 rounded-md border ">
      <div>
        <div className="flex items-center gap-2">
          <MessagesSquare />
          <div>
            <p className="">{room.tittle}</p>
            <p className="text-xs opacity-70">{room.description}</p>
          </div>
        </div>
        <Separator className="mt-2" />
      </div>
      <div className="flex grow flex-col-reverse p-4 overflow-auto">
        <MessagesList club={club} room={room} />
      </div>
      <form onSubmit={handleSubmit(sendNewMessage)}>
        <div className="flex items-center gap-2">
          <Input
            {...register("message", { required: true })}
            placeholder="Type a message"
          />
          <Button disabled={!newMessage} size="icon" className="size-8">
            <SendHorizontal />
          </Button>
        </div>
      </form>
    </div>
  );
}

function MessagesList({ club, room }: { club: BookClub; room: RoomType }) {
  const timestamp = useMemo(() => Date.now(), [club.id, room.id]);

  const { data: me } = useGetMeQuery();

  const { data: messages = [], isLoading } = useGetMessagesQuery({
    clubId: club.id,
    roomId: room.id,
    dto: {
      beforeTimestamp: timestamp,
      limit: 999,
    },
  });

  if (!me || isLoading) {
    return <></>;
  }

  if (messages.length === 0) {
    return (
      <>
        <ArrowDown color="var(--secondary)" className="mx-auto mb-4" />
        <p className="text-secondary text-center">
          Be the first one to send a message.
        </p>
      </>
    );
  }

  return messages.map((current, index, array) => {
    const next = index < array.length - 1 ? array[index + 1] : null;

    if (current.authorId === me.id) {
      return <MyMessage message={current} key={current.id} />;
    } else {
      return (
        <ForeignMessage
          key={current.id}
          message={current}
          last={next === null || next.authorId !== current.authorId}
        />
      );
    }
  });
}

const style = "bg-accent px-2 py-1 rounded-md max-w-md ";

function ForeignMessage({
  message,
  last,
}: {
  message: Message;
  last: boolean;
}) {
  const { data: user } = useGetUserQuery(message.authorId);

  const af = user
    ? `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`
    : "__";

  const date = new Date(message.timestamp);

  const fixedPart = (
    <div className="flex items-end gap-2 ">
      <p>{message.body}</p>
      <p className="text-xs text-right p-0 m-0 -mb-1">
        {date.getHours().toString().padStart(2, "0")}:
        {date.getMinutes().toString().padStart(2, "0")}
      </p>
    </div>
  );

  if (!user || !last) {
    return (
      <div className="flex relative mt-0.5">
        <div className={style + "ml-12"}>{fixedPart}</div>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-[min-content_auto] gap-4 mt-2">
        <Avatar>
          <AvatarFallback style={{ backgroundColor: tint(user.color) }}>
            {af}
          </AvatarFallback>
        </Avatar>

        <div className="flex relative">
          <div className="absolute left-3 top-1 w-4 h-4 -ml-4 bg-accent rotate-45 -z-10"></div>
          <div className={style}>
            <p className="font-bold">{user.username}</p>
            {fixedPart}
          </div>
        </div>
      </div>
    );
  }
}

function MyMessage({ message }: { message: Message }) {
  const myClr = useMyColor();
  const date = new Date(message.timestamp);

  return (
    <div className="flex ml-auto mt-0.5">
      <div
        className={style}
        style={{
          backgroundColor: myClr,
        }}
      >
        <div className="flex items-end gap-2">
          <p>{message.body}</p>
          <p className="text-xs text-right p-0 m-0 -mb-1">
            {date.getHours().toString().padStart(2, "0")}:
            {date.getMinutes().toString().padStart(2, "0")}
          </p>
        </div>
      </div>
    </div>
  );

  // return <div className="ml-auto">{message.body}</div>;

  // <div className="flex relative mt-0.5">
  //   <div className={style + "ml-12"}>{fixedPart}</div>
  // </div>
}
