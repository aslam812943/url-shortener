import { CreateUrlDto } from '../dto/create-url.dto';
import { IUrl } from './url.interface';

export interface IUrlService {
  shortenUrl(createUrlDto: CreateUrlDto): Promise<IUrl>;
  getOriginalUrl(shortCode: string): Promise<string>;
  getUserUrls(userId: string, page: number, limit: number): Promise<IUrl[]>;
}
