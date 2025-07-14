export interface CreateBookClubDto {
  tittle: string;
  description: string;
}

export function isValidCreateBookClubDto(
  dto: Partial<CreateBookClubDto>,
): dto is CreateBookClubDto {
  if (!dto.tittle || !dto.description) {
    return false;
  }
  return true;
}
