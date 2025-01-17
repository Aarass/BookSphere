export interface CreateBookDto {
  isbn: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  genreIds: string[];
}

export function isValidCreateBookDto(
  dto: Partial<CreateBookDto>
): dto is CreateBookDto {
  if (
    !dto.isbn ||
    !dto.title ||
    !dto.description ||
    !dto.imageUrl ||
    !dto.authorId ||
    !dto.genreIds ||
    dto.genreIds.length == 0
  ) {
    return false;
  }
  return true;
}

export interface SetReadingStatus {
  status: boolean;
}

export function isValidSetReadingStatus(
  dto: Partial<SetReadingStatus>
): dto is SetReadingStatus {
  if (dto.status === undefined) {
    return false;
  }
  return true;
}

export interface CreateCommentDto {
  content: string;
}

export function isValidCreateCommentDto(
  dto: Partial<CreateCommentDto>
): dto is CreateCommentDto {
  if (!dto.content) {
    return false;
  }
  return true;
}

export interface CreateRatingDto {
  value: number;
}

export type UpdateRatingDto = CreateRatingDto;

export function isValidCreateRatingDto(
  dto: Partial<CreateRatingDto>
): dto is CreateRatingDto {
  if (dto.value === undefined) {
    return false;
  }
  return true;
}

export function isValidUpdateRatingDto(
  dto: Partial<UpdateRatingDto>
): dto is UpdateRatingDto {
  if (dto.value === undefined || typeof dto.value !== "number" || dto.value <= 0) {
    return false;
  }
  return true;
}
