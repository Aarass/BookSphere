export interface CreateGenreDto {
  name: string;
}

export function isValidCreateGenreDto(
  dto: Partial<CreateGenreDto>
): dto is CreateGenreDto {
  if (!dto.name) {
    return false;
  }
  return true;
}
