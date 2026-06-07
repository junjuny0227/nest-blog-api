import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUserRepo = () => ({
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: ReturnType<typeof mockUserRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useFactory: mockUserRepo }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('이메일로 유저를 반환한다', async () => {
      const user = { id: 1, email: 'a@b.com' } as User;
      const qb = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };
      userRepo.createQueryBuilder.mockReturnValue(qb);
      const result = await service.findByEmail('a@b.com');
      expect(result).toBe(user);
    });
  });

  describe('findById', () => {
    it('id로 유저를 반환한다', async () => {
      const user = { id: 1 } as User;
      userRepo.findOne.mockResolvedValue(user);
      const result = await service.findById(1);
      expect(result).toBe(user);
    });
  });

  describe('create', () => {
    it('중복 이메일/username 시 ConflictException', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1 });
      await expect(
        service.create({ email: 'a@b.com', password: 'pw', username: 'user' }),
      ).rejects.toThrow(ConflictException);
    });

    it('정상 생성 시 User 반환', async () => {
      const user = { id: 1, email: 'a@b.com' } as User;
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(user);
      userRepo.save.mockResolvedValue(user);
      const result = await service.create({ email: 'a@b.com', password: 'pw', username: 'user' });
      expect(result).toBe(user);
    });
  });
});
