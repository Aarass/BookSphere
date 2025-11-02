export interface NoteDto {
  _id?: string;
  page: number;
  description: string;
}

export interface BookNoteDto {
  _id?: string;
  userId: string;
  isbn: string;
  notes: NoteDto[];
}

export type GetBookNoteDto = {
  userId: string;
  isbn: string;
};

export type GetSpecificBookNoteDto = GetBookNoteDto & {
  noteId: string;
};

export type CreateBookNoteDto = Pick<BookNoteDto, "userId" | "isbn">;

export type AddBookNoteDto = GetBookNoteDto & {
  description: string;
  page: number;
};

export type UpdateBookNoteDto = AddBookNoteDto & {
  noteId: string;
};

export type DeleteBookNoteDto = GetBookNoteDto & {
  noteId: string;
};
