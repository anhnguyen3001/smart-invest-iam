import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities';
import { FindConditions, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto';
import {
  OldPasswordWrongException,
  UserExistedException,
} from './user.exception';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(data: Partial<User>): Promise<User> {
    const { email, password, username } = data;

    const existedUsers = await this.userRepo.find({ where: { email } });
    if (existedUsers.length) {
      throw new UserExistedException();
    }

    const hashPassword = await this.hashPassword(password);

    return this.userRepo.save(
      this.userRepo.create({
        email,
        username,
        password: hashPassword,
      }),
    );
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);

    return this.userRepo.save({
      ...user,
      ...data,
    });
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    data.validate();

    const user = await this.findOneById(id);

    const { oldPassword, newPassword } = data;
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
      throw new OldPasswordWrongException();
    }

    const hashPassword = await this.hashPassword(newPassword);

    return this.userRepo.save({
      ...user,
      password: hashPassword,
    });
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepo.findOne({ id });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }

  async findOne(condition: FindConditions<User>): Promise<User> {
    return this.userRepo.findOne({ where: condition });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
