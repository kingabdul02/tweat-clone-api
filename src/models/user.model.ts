import { Post } from "@prisma/client";

export interface UserResponseDTO {
    id: number;
    name: string;
    email: Date;
    posts?: Post[];
}
