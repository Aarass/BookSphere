export interface CreateRoomDto {
  title: string;
  desc: string;
}

export function isValidLoginDto(
  dto: Partial<CreateRoomDto>
): dto is CreateRoomDto {
  if (!dto.title || !dto.desc) {
    return false;
  }
  return true;
}
