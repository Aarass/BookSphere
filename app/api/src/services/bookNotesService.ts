import { Book } from "@interfaces/book";
// import { userRecommendationRepository } from "../repositories/userRecommendationRepository";
import bookService from "./bookService";
import { userBookNotesRepository } from "../repositories/userBookNotesRepository";
import {
  AddBookNoteDto,
  BookNoteDto,
  DeleteBookNoteDto,
  GetBookNoteDto,
  NoteDto,
  UpdateBookNoteDto,
} from "@interfaces/dtos/bookNotesDto";
import { UpdateBookDto } from "@interfaces/dtos/bookDto";

class BookNotesService {
  async createBookNote(userId: string, isbn: string): Promise<BookNoteDto> {
    return await userBookNotesRepository.creteBookNote({ userId, isbn });
  }

  async addBookNote(data: AddBookNoteDto): Promise<BookNoteDto> {
    const result = await userBookNotesRepository.addBookNote(data);

    if (!result) {
      throw new Error("No note with that ID found");
    }

    return result;
  }

  async getBookNotes(
    userId: string,
    isbn: string
  ): Promise<BookNoteDto | null> {
    const notes = await userBookNotesRepository.getBookNotes(userId, isbn);

    return notes;
  }

  async getSpecificBookNote(
    noteId: string,
    userId: string,
    isbn: string
  ): Promise<NoteDto | null> {
    const note = await userBookNotesRepository.getSpecificBookNote(
      noteId,
      userId,
      isbn
    );

    return note;
  }

  async updateBookNote(data: UpdateBookNoteDto): Promise<BookNoteDto> {
    const notes = await userBookNotesRepository.updateBookNote(data);

    if (!notes) {
      throw new Error("No note with that ID found");
    }

    return notes;
  }

  async deleteNote(data: DeleteBookNoteDto): Promise<BookNoteDto> {
    const result = await userBookNotesRepository.deleteNote(data);

    if (!result) {
      throw new Error("No note with that ID found");
    }

    return result;
  }
}

export const bookNotesService = new BookNotesService();
