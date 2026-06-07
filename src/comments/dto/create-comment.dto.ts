import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '댓글 내용입니다.', description: '댓글 본문' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
