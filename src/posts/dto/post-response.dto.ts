import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PostResponseDto {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
