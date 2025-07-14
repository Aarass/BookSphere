import { CreateCommentDto, UpdateCommentDto } from "@interfaces/dtos/bookDto";
import { bookRepository } from "../repositories/bookRepository";
import { statsRepository } from "../repositories/statsRepository";

async function createComment(
  isbn: string,
  userId: string,
  dto: CreateCommentDto,
) {
  const comment = await bookRepository.createComment(isbn, userId, dto.content);

  setImmediate(async () => {
    await statsRepository.onCommentCreated(isbn);
  });

  return comment;
}

async function updateComment(
  isbn: string,
  userId: string,
  dto: UpdateCommentDto,
) {
  return await bookRepository.updateComment(isbn, userId, dto.content);
}

async function deleteComment(isbn: string, userId: string) {
  const result = await bookRepository.deleteComment(isbn, userId);

  setImmediate(async () => {
    try {
      await statsRepository.onCommentDeleted(isbn);
    } catch (error) {
      console.error("Error updating stats after comment deletion:", error);
    }
  });

  return result;
}

async function getComments(isbn: string) {
  return await bookRepository.getComments(isbn);
}

async function getComment(userId: string, isbn: string) {
  return await bookRepository.getComment(userId, isbn);
}

export default {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};
