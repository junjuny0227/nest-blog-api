import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: '이메일 주소' })
  email: string;

  @ApiProperty({ example: 'john_doe', description: '사용자명' })
  username: string;

  @ApiProperty({ example: '2026-06-08T00:00:00.000Z', description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-08T00:00:00.000Z', description: '수정일시' })
  updatedAt: Date;
}
