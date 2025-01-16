import { CreateGenreDto } from "@interfaces/dtos/genreDto";
import { genreRepository } from "../repositories/genreRepository";

async function createGenre(dto: CreateGenreDto) {
  return await genreRepository.create(dto.name);
}

async function getGenreById(id: string) {
  return await genreRepository.getById(id);
}

async function getAllGenres() {
  return await genreRepository.getAll();
}

export default {
  createGenre,
  getGenreById,
  getAllGenres,
};
