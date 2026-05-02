import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-dto';
import type { IUserRepository } from './interfaces/user-repository.interface';
import type { IUserService } from './interfaces/user-service.interface';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: IUserRepository,
    ) { }
    async register(registerDto: RegisterUserDto) {
        const { name, email, password } = registerDto;
      
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);
        
        try {
            const newUser = await this.userRepository.create({
                name,
                email,
                password: hashedPassword,
            });
            return {
                message: 'User registered successfully',
                userId: newUser.id,
            };
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
                throw new ConflictException('User already exists');
            }
            throw err;
        }
    }
}