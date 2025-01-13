export interface RegisterDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  color: string;
}

export function isValidRegisterDto(
  dto: Partial<RegisterDto>
): dto is RegisterDto {
  if (!dto.username || !dto.password || !dto.firstName || !dto.lastName) {
    return false;
  }
  return true;
}
