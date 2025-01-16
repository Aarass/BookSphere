import { CreateAuthorDto } from "@interfaces/dtos/authorDto";
import { authorRepository } from "../repositories/authorRepository";

async function createAuthor(dto: CreateAuthorDto) {
  return await authorRepository.create(dto.fullName);
}

async function getAuthorById(id: string) {
  return await authorRepository.getById(id);
}

async function getAllAuthors() {
  return await authorRepository.getAll();
}

export default {
  createAuthor,
  getAuthorById,
  getAllAuthors,
};
