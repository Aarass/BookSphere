import { Author } from "./author";
import { Genre } from "./genre";

export interface BookRaw {
  isbn: string;
  title: string;
  description: string;
}

export interface Book extends BookRaw {
  author: Author;
  genre: Genre;
}
