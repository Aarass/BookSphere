import { CreateBookClubDto } from "@interfaces/dtos/bookClubDto";
import { bookClubRepository } from "../repositories/bookClubRepository";

async function createBookClub(data: CreateBookClubDto) {
  return await bookClubRepository.create(data.tittle, data.description);
}

async function getAllBookClubs(userId: string | null) {
  return await bookClubRepository.getAll(userId);
}

async function getBookClub(bookClubId: string, userId: string | null) {
  return await bookClubRepository.getById(bookClubId, userId);
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
  getBookClub,
  joinBookClub,
  leaveBookClub,
  getJoinedBookClubs,
};
