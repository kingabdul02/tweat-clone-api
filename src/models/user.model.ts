import { Post } from "@prisma/client";

export class UserRequestDTO {
    name: string;
    email: string;
    password!: string;
}
export interface UserResponseDTO {
    id: number;
    name: string;
    email: string;
    posts?: Post[];
}

export class LoginRequestDto {
    email!: string;
    password!: string;
}

export interface LoginResponseDto {
    access_token: string;
    user: UserResponseDTO;
}

export interface AuthLoggedInUserDto {
    id: number;
    name: string;
  }