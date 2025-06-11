import { Book } from "./book";

export interface RecommendationList {
  _id: string;
  neo4jUserId: string;
  description: string;
  bookIsbns: string[];
  createdAt: Date;
}

export interface RecommendationListWithBooks extends Omit<RecommendationList, "bookIsbns"> {
  books: Book[];
}