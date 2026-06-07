import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async findAll(query: PaginatePostDto) {
    const { page, limit } = query;
    const [data, total] = await this.postRepo.findAndCount({
      relations: { author: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id }, relations: { author: true } });
    if (!post) {
      throw new NotFoundException(`게시글 #${id}를 찾을 수 없습니다.`);
    }
    return post;
  }

  async create(dto: CreatePostDto, authorId: number): Promise<Post> {
    const post = this.postRepo.create({ ...dto, authorId });
    return this.postRepo.save(post);
  }

  async update(id: number, dto: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('본인이 작성한 게시글만 수정할 수 있습니다.');
    }
    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('본인이 작성한 게시글만 삭제할 수 있습니다.');
    }
    await this.postRepo.remove(post);
  }
}
