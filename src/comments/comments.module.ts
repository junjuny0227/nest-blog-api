import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { PostCommentsController } from './post-comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [PostCommentsController, CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
