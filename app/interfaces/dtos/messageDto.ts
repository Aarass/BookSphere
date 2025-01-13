export interface CreateMessageDto {
  content: string;
  bookClubId: string;
  roomId: string;
}

export function isValidCreateMessageDto(
  dto: Partial<CreateMessageDto>
): dto is CreateMessageDto {
  if (!dto.content || !dto.bookClubId || !dto.roomId) {
    return false;
  }
  return true;
}

export interface ReadMessagesDto {
  beforeTimestamp: number;
  limit: number;
}

export function isValidReadMessagesDto(
  dto: Partial<ReadMessagesDto>
): dto is ReadMessagesDto {
  if (!dto.beforeTimestamp || !dto.limit) {
    return false;
  }
  return true;
}
