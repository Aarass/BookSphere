import { Author } from "./author";
import { Genre } from "./genre";

export interface BookRaw {
  isbn: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Book extends BookRaw {
  author: Author;
  genres: Genre[];
}

export interface BookStats {
  ratingsCount: number;
  ratingsSum: number;
  commentsCoutn: number;
  currentlyReadingCount: number;
}
