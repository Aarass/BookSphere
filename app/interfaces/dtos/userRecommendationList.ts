import { BookRaw } from "../book";

export interface UserRecommendationListDto {
  _id?: string;
  neo4jUserId: string;
  description: string;
  bookIsbns: string[];
  createdAt: Date;
}

export interface AddBookToListDto {
  isbn: BookRaw["isbn"];
}

export type RemoveBookFromListDto = AddBookToListDto;

