export interface LoginDto {
  username: string;
  password: string;
}

export function isValidLoginDto(dto: Partial<LoginDto>): dto is LoginDto {
  if (!dto.username || !dto.password) {
    return false;
  }
  return true;
}
