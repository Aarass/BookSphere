export interface CreateAuthorDto {
  fullName: string;
}

export function isValidCreateAuthorDto(
  dto: Partial<CreateAuthorDto>
): dto is CreateAuthorDto {
  if (!dto.fullName) {
    return false;
  }
  return true;
}
