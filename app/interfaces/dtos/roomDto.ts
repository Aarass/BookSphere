export interface CreateRoomDto {
  title: string;
  description: string;
}

export function isValidCreateRoomDto(
  dto: Partial<CreateRoomDto>
): dto is CreateRoomDto {
  if (!dto.title || !dto.description) {
    return false;
  }
  return true;
}
