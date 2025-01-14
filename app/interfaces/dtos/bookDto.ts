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

export function isValidCreateRatingDto(
  dto: Partial<CreateRatingDto>
): dto is CreateRatingDto {
  if (dto.value === undefined) {
    return false;
  }
  return true;
}
