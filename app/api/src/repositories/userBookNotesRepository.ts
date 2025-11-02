import { ObjectId } from "mongodb";
import { getDb } from "../drivers/mongo";
import {
  AddBookNoteDto,
  BookNoteDto,
  CreateBookNoteDto,
  DeleteBookNoteDto,
  GetBookNoteDto,
  NoteDto,
  UpdateBookNoteDto,
} from "@interfaces/dtos/bookNotesDto";

const COLLECTION_NAME = "userBookNotes";

class UserBookNotesRepository {
  async creteBookNote({
    isbn,
    userId,
  }: CreateBookNoteDto): Promise<BookNoteDto> {
    const db = getDb();

    const result = await db.collection(COLLECTION_NAME).insertOne({
      userId,
      isbn,
      notes: [],
    });

    return {
      _id: result.insertedId.toHexString(),
      userId,
      isbn,
      notes: [],
    };
  }

  async addBookNote({
    userId,
    isbn,
    description,
    page,
  }: AddBookNoteDto): Promise<BookNoteDto | null> {
    const db = getDb();

    const note: NoteDto = {
      _id: new ObjectId().toHexString(),
      page,
      description,
    };

    const result = await db
      .collection<BookNoteDto>(COLLECTION_NAME)
      .findOneAndUpdate(
        { userId, isbn },
        {
          $push: {
            notes: note,
          },
        }
      );

    return result;
  }

  async getBookNotes(
    userId: string,
    isbn: string
  ): Promise<BookNoteDto | null> {
    const db = getDb();

    const result = await db
      .collection<BookNoteDto>(COLLECTION_NAME)
      .findOne({ userId, isbn });

    return result;
  }

  async getSpecificBookNote(
    noteId: string,
    userId: string,
    isbn: string
  ): Promise<NoteDto | null> {
    const db = getDb();

    const result = await db.collection<BookNoteDto>(COLLECTION_NAME).findOne({
      userId,
      isbn,
    });

    const resNote = result?.notes.find((elem) => {
      return elem._id == noteId;
    });

    return resNote || null;
  }

  async updateBookNote({
    isbn,
    userId,
    noteId,
    page,
    description,
  }: UpdateBookNoteDto): Promise<BookNoteDto> {
    const db = getDb();

    const newNote: NoteDto = {
      _id: noteId,
      page,
      description,
    };

    const collection = db.collection<BookNoteDto>(COLLECTION_NAME);

    const result = await collection.findOneAndUpdate(
      { userId, isbn, "notes._id": noteId },
      { $set: { "notes.$": newNote } }
    );

    if (!result) {
      throw "No note with that ID found";
    }

    return result;
  }

  async deleteNote({
    userId,
    isbn,
    noteId,
  }: DeleteBookNoteDto): Promise<BookNoteDto | null> {
    const db = getDb();
    const collection = db.collection<BookNoteDto>(COLLECTION_NAME);

    const result = await collection.findOneAndUpdate(
      { userId, isbn },
      { $pull: { notes: { _id: noteId } } }
    );

    return result;
  }
}

export const userBookNotesRepository = new UserBookNotesRepository();
