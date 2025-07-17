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

// completed  -> null          del   skip
// reading    -> null          del   dec
// null       -> completed     cre   skip
// reading    -> completed     set   dec
// null       -> reading       cre   inc
// completed  -> reading       set   inc
async function setReadingStatus(
  isbn: string,
  userId: string,
  dto: SetReadingStatus,
) {
  const { previousValue, genreIds } = await bookRepository.setReadingStatus(
    isbn,
    userId,
    dto.status,
  );

  if (previousValue === dto.status) return; // no need to update leaderboards
  let status;
  if (dto.status === "reading") {
    status = true;
  } else if (dto.status === "completed") {
    if (previousValue === "reading") {
      status = false;
    } else {
      return; // no need to update leaderboards
    }
  } else if (dto.status === "null") {
    if (previousValue === "reading") {
      status = false;
    } else {
      return; // no need to update leaderboards
    }
  } else {
    dto.status satisfies never;
    throw new Error("Impossible");
  }

  setImmediate(async () => {
    await statsRepository.onReadingStatusChanged(isbn, status);
    await leaderboardRepository.updateReadersLeaderboards(
      isbn,
      genreIds,
      status,
    );
  });
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

// const hasChanged =
//   updates.relationshipsDeleted > 0 ||
//   updates.relationshipsCreated > 0 ||
//   updates.propertiesSet;
//
// if (!hasChanged) return;
//
// // completed  -> null          del   skip
// // reading    -> null          del   dec
// // null       -> completed     cre   skip
// // reading    -> completed     set   dec
// // null       -> reading       cre   inc
// // completed  -> reading       set   inc
//
// let status;
// if (dto.status === "completed") {
//   if (updates.relationshipsCreated === 1) {
//     return;
//   } else if (updates.propertiesSet === 1) {
//     status = false;
//   } else {
//     throw new Error("Developer error");
//   }
// } else if (dto.status === "reading") {
//   assert(updates.relationshipsCreated === 1 || updates.propertiesSet === 1);
//   status = true;
// } else {
//   // TODO
//   if (false) {
//     return;
//   } else {
//     status = false;
//   }
// }
