import { ReadingStatus } from "@interfaces/book";
import { CreateBookDto, SetReadingStatus } from "@interfaces/dtos/bookDto";
import { bookRepository } from "../repositories/bookRepository";
import { leaderboardRepository } from "../repositories/leaderboardRepository";
import { statsRepository } from "../repositories/statsRepository";
import { User } from "@interfaces/user";

async function createBook(dto: CreateBookDto) {
  const book = await bookRepository.createBook(
    dto.isbn,
    dto.title,
    dto.description,
    dto.imageUrl,
    dto.authorId,
    dto.genreIds,
  );

  setImmediate(async () => {
    leaderboardRepository.onBookCreated(book);
  });

  return book;
}

async function getBookByISBN(isbn: string) {
  return await bookRepository.getByISBN(isbn);
}

async function getAllBooks() {
  return await bookRepository.getAll();
}

async function getCurrentlyReadingBooks(userId: User["id"]) {
  return await bookRepository.getCurrentlyReadingBooks(userId);
}

async function deleteBook(isbn: string) {
  const deletedBook = await bookRepository.delete(isbn);

  setImmediate(async () => {
    statsRepository.onBookDeleted(deletedBook);
    leaderboardRepository.onBookDeleted(deletedBook);
  });

  return deletedBook;
}

async function getReadingStatus(
  isbn: string,
  userId: string,
): Promise<ReadingStatus> {
  return await bookRepository.getReadingStatus(isbn, userId);
}

async function setReadingStatus(
  isbn: string,
  userId: string,
  dto: SetReadingStatus,
) {
  const { hasChanged, genreIds } = await bookRepository.setReadingStatus(
    isbn,
    userId,
    dto.status,
  );

  if (hasChanged) {
    setImmediate(async () => {
      await statsRepository.onReadingStatusChanged(isbn, dto.status);
      await leaderboardRepository.updateReadersLeaderboards(
        isbn,
        genreIds,
        dto.status,
      );
    });
  }
}

async function getStats(isbn: string) {
  return await statsRepository.getStats(isbn);
}

export default {
  createBook,
  getBookByISBN,
  getAllBooks,
  getCurrentlyReadingBooks,
  deleteBook,
  getReadingStatus,
  setReadingStatus,
  getStats,
};
