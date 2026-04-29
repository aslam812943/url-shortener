import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator'; 
export class RegisterUserDto {
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name is too long.' }) 
  name: string;
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(20, { message: 'Password is too long.' }) 
  @Matches(/\S/, { message: 'Password cannot be only whitespace' })
  password: string;
}