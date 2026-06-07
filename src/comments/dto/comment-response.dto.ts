import { UserResponseDto } from '../../users/dto/user-response.dto';

export class CommentResponseDto {
  id: number;
  content: string;
  authorId: number;
  postId: number;
  author?: UserResponseDto;
  createdAt: Date;
}
