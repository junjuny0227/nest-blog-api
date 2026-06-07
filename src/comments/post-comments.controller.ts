import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginateCommentDto } from './dto/paginate-comment.dto';

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findByPost(@Param('postId', ParseIntPipe) postId: number, @Query() query: PaginateCommentDto) {
    return this.commentsService.findByPost(postId, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.commentsService.create(postId, dto, user.id);
  }
}
