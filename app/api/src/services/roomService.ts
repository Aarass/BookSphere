import { CreateRoomDto } from "@interfaces/dtos/roomDto";
import { bookClubRepository } from "../repositories/bookClubRepository";
import { roomRepository } from "../repositories/roomRepository";

async function createRoom(bookClubId: string, data: CreateRoomDto) {
  let newRoom = await roomRepository.create(data.tittle, data.description);
  await bookClubRepository.takeOwnershipOfRoom(bookClubId, newRoom.id);

  return newRoom;
}

async function getAllInBookClub(bookClubId: string) {
  return await roomRepository.getAllInBookClub(bookClubId);
}

async function getRoomById(bookClubId: string, roomId: string) {
  return await roomRepository.getRoomById(bookClubId, roomId);
}

export default { createRoom, getAllInBookClub, getRoomById };
