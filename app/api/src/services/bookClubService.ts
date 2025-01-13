import { CreateBookClubDto } from "@interfaces/dtos/bookClubDto";
import { bookClubRepository } from "../repositories/bookClubRepository";

async function createBookClub(data: CreateBookClubDto) {
  return await bookClubRepository.create(data.title, data.description);
}

async function getAllBookClubs() {
  return await bookClubRepository.getAll();
}

async function getJoinedBookClubs(userId: string) {
  return await bookClubRepository.getJoined(userId);
}

async function joinBookClub(bookClubId: string, userId: string) {
  return await bookClubRepository.join(bookClubId, userId);
}

async function leaveBookClub(bookClubId: string, userId: string) {
  return await bookClubRepository.leave(bookClubId, userId);
}

export default {
  createBookClub,
  getAllBookClubs,
  joinBookClub,
  leaveBookClub,
  getJoinedBookClubs,
};
