import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

const mockRepo = () => ({
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('CommentsService', () => {
  let service: CommentsService;
  let commentRepo: ReturnType<typeof mockRepo>;
  let postRepo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useFactory: mockRepo },
        { provide: getRepositoryToken(Post), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentRepo = module.get(getRepositoryToken(Comment));
    postRepo = module.get(getRepositoryToken(Post));
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('게시글 없으면 NotFoundException', async () => {
      postRepo.findOne.mockResolvedValue(null);
      await expect(service.create(1, { content: 'hi' }, 1)).rejects.toThrow(NotFoundException);
    });

    it('정상 생성 시 author 포함 Comment 반환', async () => {
      const post = { id: 1 } as Post;
      const comment = { id: 1 } as Comment;
      const commentWithAuthor = { id: 1, author: { id: 1 } } as unknown as Comment;
      postRepo.findOne.mockResolvedValue(post);
      commentRepo.create.mockReturnValue(comment);
      commentRepo.save.mockResolvedValue(comment);
      commentRepo.findOne.mockResolvedValue(commentWithAuthor);
      const result = await service.create(1, { content: 'hi' }, 1);
      expect(result).toBe(commentWithAuthor);
    });
  });

  describe('findByPost', () => {
    it('게시글 없으면 NotFoundException', async () => {
      postRepo.findOne.mockResolvedValue(null);
      await expect(service.findByPost(1, { page: 1, limit: 20 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('페이지네이션 포함 결과 반환', async () => {
      const post = { id: 1 } as Post;
      const comments = [{ id: 1 }] as Comment[];
      postRepo.findOne.mockResolvedValue(post);
      commentRepo.findAndCount.mockResolvedValue([comments, 1]);
      const result = await service.findByPost(1, { page: 1, limit: 20 });
      expect(result).toEqual({ data: comments, total: 1, page: 1, limit: 20 });
    });
  });

  describe('remove', () => {
    it('댓글 없으면 NotFoundException', async () => {
      commentRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('authorId 불일치 시 ForbiddenException', async () => {
      commentRepo.findOne.mockResolvedValue({ id: 1, authorId: 2 });
      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('정상 삭제', async () => {
      const comment = { id: 1, authorId: 1 } as Comment;
      commentRepo.findOne.mockResolvedValue(comment);
      commentRepo.remove.mockResolvedValue(comment);
      await expect(service.remove(1, 1)).resolves.toBeUndefined();
    });
  });
});
