import { CreateBookDto, SetReadingStatus } from "@interfaces/dtos/bookDto";
import { bookRepository } from "../repositories/bookRepository";
import { statsRepository } from "../repositories/statsRepository";

async function createBook(dto: CreateBookDto) {
  const book = await bookRepository.createBook(
    dto.isbn,
    dto.title,
    dto.description,
    dto.imageUrl,
    dto.authorId,
    dto.genreIds
  );

  setImmediate(async () => {
    await statsRepository.onBookCreated(book);
  });

  return book;
}

async function getBookByISBN(isbn: string) {
  return await bookRepository.getByISBN(isbn);
}

async function getAllBooks() {
  return await bookRepository.getAll();
}

async function deleteBook(isbn: string) {
  const deletedBook = await bookRepository.delete(isbn);

  setImmediate(async () => {
    statsRepository.onBookDeleted(deletedBook);
  });

  return deletedBook;
}

async function setReadingStatus(
  isbn: string,
  userId: string,
  dto: SetReadingStatus
) {
  const { hasChanged } = await bookRepository.setReadingStatus(
    isbn,
    userId,
    dto.status
  );

  if (hasChanged) {
    setImmediate(async () => {
      await statsRepository.onReadingStatusChanged(isbn, dto.status);
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
  deleteBook,
  setReadingStatus,
  getStats,
};
