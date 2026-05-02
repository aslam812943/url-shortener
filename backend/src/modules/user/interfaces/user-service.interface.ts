import { RegisterUserDto } from '../dto/register-dto';

export interface IUserService {
  register(registerDto: RegisterUserDto): Promise<{ message: string; userId?: string }>;
}
