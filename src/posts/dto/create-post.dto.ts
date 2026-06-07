import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '게시글 제목', description: '게시글 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '게시글 내용입니다.', description: '게시글 본문' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
