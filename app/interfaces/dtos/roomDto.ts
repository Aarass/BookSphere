export interface CreateRoomDto {
  tittle: string;
  description: string;
}

export function isValidCreateRoomDto(
  dto: Partial<CreateRoomDto>,
): dto is CreateRoomDto {
  if (!dto.tittle || !dto.description) {
    return false;
  }
  return true;
}
