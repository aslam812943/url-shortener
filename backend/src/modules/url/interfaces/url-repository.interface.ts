import { IUrl } from './url.interface';

export interface IUrlRepository {
  create(urlData: Partial<IUrl>): Promise<IUrl>;
  findByShortCode(shortCode: string): Promise<IUrl | null>;
  findByOriginalUrl(originalUrl: string, userId?: string): Promise<IUrl | null>;
  findAllByUserId(userId: string, skip: number, limit: number): Promise<IUrl[]>;
}
