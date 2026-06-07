import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

const mockPostRepo = () => ({
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('PostsService', () => {
  let service: PostsService;
  let postRepo: ReturnType<typeof mockPostRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, { provide: getRepositoryToken(Post), useFactory: mockPostRepo }],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepo = module.get(getRepositoryToken(Post));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('페이지네이션 형태로 반환한다', async () => {
      const posts = [{ id: 1 }] as Post[];
      postRepo.findAndCount.mockResolvedValue([posts, 1]);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toEqual({ data: posts, total: 1, page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('존재하면 Post 반환', async () => {
      const post = { id: 1 } as Post;
      postRepo.findOne.mockResolvedValue(post);
      expect(await service.findOne(1)).toBe(post);
    });

    it('없으면 NotFoundException', async () => {
      postRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('저장 후 Post 반환', async () => {
      const post = { id: 1 } as Post;
      postRepo.create.mockReturnValue(post);
      postRepo.save.mockResolvedValue(post);
      expect(await service.create({ title: 't', content: 'c' }, 1)).toBe(post);
    });
  });

  describe('update', () => {
    it('authorId 불일치 시 ForbiddenException', async () => {
      postRepo.findOne.mockResolvedValue({ id: 1, authorId: 2 });
      await expect(service.update(1, { title: 'new' }, 1)).rejects.toThrow(ForbiddenException);
    });

    it('정상 수정 후 반환', async () => {
      const post = { id: 1, authorId: 1, title: 'old', content: 'c' } as Post;
      postRepo.findOne.mockResolvedValue(post);
      postRepo.save.mockResolvedValue({ ...post, title: 'new' });
      const result = await service.update(1, { title: 'new' }, 1);
      expect(result.title).toBe('new');
    });
  });

  describe('remove', () => {
    it('authorId 불일치 시 ForbiddenException', async () => {
      postRepo.findOne.mockResolvedValue({ id: 1, authorId: 2 });
      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('정상 삭제', async () => {
      const post = { id: 1, authorId: 1 } as Post;
      postRepo.findOne.mockResolvedValue(post);
      postRepo.remove.mockResolvedValue(post);
      await expect(service.remove(1, 1)).resolves.toBeUndefined();
    });
  });
});
