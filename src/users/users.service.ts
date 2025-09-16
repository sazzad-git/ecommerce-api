import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign, SignOptions } from 'jsonwebtoken';
import { Roles } from 'src/utility/common/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(
    userSignupDto: UserSignupDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const userExists = await this.findUserByEmail(userSignupDto.email);
    if (userExists) throw new BadRequestException('Email is not available');

    const hashedPassword: string = await hash(userSignupDto.password, 10);

    const user = this.userRepository.create({
      ...userSignupDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async signIn(userSignInDto: UserSignInDto) {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();

    if (!userExists) throw new BadRequestException(' Bad creadentials');

    const matchPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );

    if (!matchPassword) throw new BadRequestException('Bad Request');

    return {
      id: userExists?.id,
      name: userExists?.name,
      email: userExists?.email,
      roles: userExists?.roles,
    };
  }

  // find email query for signup
  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  // for access token
  async accessToken(user: { id: number; email: string; roles: string[] }) {
    const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
    if (!secret) throw new Error('ACCESS_TOKEN_SECRET_KEY is missing');

    const options: SignOptions = {
      expiresIn: '30m',
    };

    return sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles[0],
      },
      secret,
      options,
    );
  }

  async findAll() {
    const allUser = await this.userRepository.find();
    return allUser;
  }

  async findOne(id: number) {
    const findAUser = this.userRepository.findOneBy({ id });
    return findAUser;
  }
}
