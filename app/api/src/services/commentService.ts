import { CreateCommentDto } from "@interfaces/dtos/bookDto";
import { bookRepository } from "../repositories/bookRepository";
import { statsRepository } from "../repositories/statsRepository";

async function createComment(
  isbn: string,
  userId: string,
  dto: CreateCommentDto
) {
  const comment = await bookRepository.createComment(isbn, userId, dto.content);

  setImmediate(async () => {
    await statsRepository.onCommentCreated(isbn);
  });

  return comment;
}

// TODO
async function deleteComment(
  isbn: string,
  userId: string,
  dto: CreateCommentDto
) {
  throw new Error("Method not implemented.");
}

async function getComments(isbn: string) {
  return await bookRepository.getComments(isbn);
}

export default {
  createComment,
  getComments,
};
