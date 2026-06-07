import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'create' | 'findByEmail'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { create: jest.fn(), findByEmail: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('password 제외한 유저 정보를 반환한다', async () => {
      const user = {
        id: 1,
        email: 'a@b.com',
        username: 'user',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (usersService.create as jest.Mock).mockResolvedValue(user);
      const result = await service.register({ email: 'a@b.com', password: 'pw', username: 'user' });
      expect(result).not.toHaveProperty('password');
    });

    it('UsersService.create가 throw하면 전파된다', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (usersService.create as jest.Mock).mockRejectedValue(new Error('conflict'));
      await expect(
        service.register({ email: 'a@b.com', password: 'pw', username: 'user' }),
      ).rejects.toThrow('conflict');
    });
  });

  describe('login', () => {
    it('이메일 없으면 UnauthorizedException', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(service.login({ email: 'a@b.com', password: 'pw' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('비밀번호 불일치 시 UnauthorizedException', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('정상 로그인 시 accessToken 반환', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('token123');
      const result = await service.login({ email: 'a@b.com', password: 'pw' });
      expect(result).toEqual({ accessToken: 'token123' });
    });
  });
});
