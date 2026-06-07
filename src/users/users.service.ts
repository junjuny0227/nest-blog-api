import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(data: Pick<User, 'email' | 'password' | 'username'>): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: [{ email: data.email }, { username: data.username }],
    });
    if (existing) {
      throw new ConflictException('이미 사용 중인 이메일 또는 사용자명입니다.');
    }
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
