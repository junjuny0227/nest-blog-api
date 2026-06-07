import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}

  async create(postId: number, dto: CreateCommentDto, authorId: number): Promise<Comment> {
    await this.postsService.findOne(postId);
    const comment = this.commentRepo.create({ ...dto, postId, authorId });
    return this.commentRepo.save(comment);
  }

  async findByPost(postId: number): Promise<Comment[]> {
    await this.postsService.findOne(postId);
    return this.commentRepo.find({
      where: { postId },
      order: { createdAt: 'ASC' },
    });
  }

  async remove(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException(`댓글 #${commentId}를 찾을 수 없습니다.`);
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenException('본인이 작성한 댓글만 삭제할 수 있습니다.');
    }
    await this.commentRepo.remove(comment);
  }
}
