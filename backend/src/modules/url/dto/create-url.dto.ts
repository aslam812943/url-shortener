import { IsUrl, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty({ message: 'URL is required' })
  @IsUrl({}, { message: 'Please enter a valid URL' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
