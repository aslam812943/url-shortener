import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import type { IUrlRepository } from './interfaces/url-repository.interface';
import { CreateUrlDto } from './dto/create-url.dto';
import { IUrl } from './interfaces/url.interface';
import type { IUrlService } from './interfaces/url-service.interface';

@Injectable()
export class UrlService implements IUrlService {
  constructor(
    @Inject('URL_REPOSITORY')
    private readonly urlRepository: IUrlRepository,
  ) {}

  async shortenUrl(createUrlDto: CreateUrlDto): Promise<IUrl> {
    const { originalUrl, userId } = createUrlDto;

    const existingUrl = await this.urlRepository.findByOriginalUrl(originalUrl, userId);
    if (existingUrl) {
      return existingUrl;
    }

    let maxRetries = 3;
    while (maxRetries > 0) {
      const shortCode = nanoid(8);
      const isCodeTaken = await this.urlRepository.findByShortCode(shortCode);
      
      if (!isCodeTaken) {
        try {
          return await this.urlRepository.create({
            originalUrl,
            shortCode,
            userId,
          });
        } catch (err: unknown) {
          if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
            maxRetries--;
            continue;
          }
          throw err;
        }
      }
      maxRetries--;
    }
    
    throw new Error('Could not generate a unique short code after multiple attempts');
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw new NotFoundException('URL not found');
    }

  
    return url.originalUrl;
  }

  async getUserUrls(userId: string, page: number, limit: number): Promise<IUrl[]> {
    const skip = (page - 1) * limit;
    return await this.urlRepository.findAllByUserId(userId, skip, limit);
  }
}
