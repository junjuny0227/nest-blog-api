import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginateCommentDto } from './dto/paginate-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  private async assertPostExists(postId: number): Promise<void> {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`게시글 #${postId}를 찾을 수 없습니다.`);
    }
  }

  async create(postId: number, dto: CreateCommentDto, authorId: number): Promise<Comment> {
    await this.assertPostExists(postId);
    const comment = this.commentRepo.create({ ...dto, postId, authorId });
    const saved = await this.commentRepo.save(comment);
    return this.commentRepo.findOne({
      where: { id: saved.id },
      relations: { author: true },
    }) as Promise<Comment>;
  }

  async findByPost(
    postId: number,
    query: PaginateCommentDto,
  ): Promise<{ data: Comment[]; total: number; page: number; limit: number }> {
    await this.assertPostExists(postId);
    const [data, total] = await this.commentRepo.findAndCount({
      where: { postId },
      relations: { author: true },
      order: { createdAt: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return { data, total, page: query.page, limit: query.limit };
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
