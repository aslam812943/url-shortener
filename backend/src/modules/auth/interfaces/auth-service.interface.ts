import { LoginUserDto } from '../dto/login-user.dto';

export interface IAuthService {
  login(loginDto: LoginUserDto): Promise<{ access_token: string; user: { id?: string; email: string; name: string } }>;
}
