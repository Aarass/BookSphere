export interface CreateBookClubDto {
  title: string;
  description: string;
}

export function isValidCreateBookClubDto(
  dto: Partial<CreateBookClubDto>
): dto is CreateBookClubDto {
  if (!dto.title || !dto.description) {
    return false;
  }
  return true;
}
