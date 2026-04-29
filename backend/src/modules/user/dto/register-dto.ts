import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator'; 
import { Transform } from 'class-transformer';
export class RegisterUserDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name is too long.' }) 
  @Matches(/\S/, { message: 'Name cannot be only whitespace' })
  name: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(100, { message: 'Password is too long.' }) 
  @Matches(/\S/, { message: 'Password cannot be only whitespace' })
  password: string;
}