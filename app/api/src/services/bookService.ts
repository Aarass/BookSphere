import {
  CreateCommentDto,
  CreateRatingDto,
  SetReadingStatus,
} from "@interfaces/dtos/bookDto";
import { bookRepository } from "../repositories/bookRepository";

async function getBookByISBN(isbn: string) {
  return await bookRepository.getByISBN(isbn);
}

async function getAllBooks() {
  return await bookRepository.getAll();
}

async function setReadingStatus(
  isbn: string,
  userId: string,
  dto: SetReadingStatus
) {
  return await bookRepository.setReadingStatus(isbn, userId, dto.status);
}

async function createComment(
  isbn: string,
  userId: string,
  dto: CreateCommentDto
) {
  return await bookRepository.createComment(isbn, userId, dto.content);
}

async function getComments(isbn: string) {
  return await bookRepository.getComments(isbn);
}

async function createRating(
  isbn: string,
  userId: string,
  dto: CreateRatingDto
) {
  return await bookRepository.createRating(isbn, userId, dto.value);
}

async function getRating(isbn: string, userId: string) {
  return await bookRepository.getRating(isbn, userId);
}

async function getStats(isbn: string) {
  return await bookRepository.getStats(isbn);
}

export default {
  getBookByISBN,
  getAllBooks,
  setReadingStatus,
  createComment,
  getComments,
  createRating,
  getRating,
  getStats,
};
