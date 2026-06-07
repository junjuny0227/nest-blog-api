import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PostResponseDto {
  @ApiProperty({ example: 1, description: '게시글 ID' })
  id: number;

  @ApiProperty({ example: '게시글 제목', description: '게시글 제목' })
  title: string;

  @ApiProperty({ example: '게시글 내용입니다.', description: '게시글 본문' })
  content: string;

  @ApiProperty({ example: 1, description: '작성자 ID' })
  authorId: number;

  @ApiPropertyOptional({ type: () => UserResponseDto, description: '작성자 정보' })
  author?: UserResponseDto;

  @ApiProperty({ example: '2026-06-08T00:00:00.000Z', description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-08T00:00:00.000Z', description: '수정일시' })
  updatedAt: Date;
}
