import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import type { IUrlRepository } from './interfaces/url-repository.interface';
import { CreateUrlDto } from './dto/create-url.dto';
import { IUrl } from './interfaces/url.interface';

@Injectable()
export class UrlService {
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

    // Generate unique short code
    let shortCode = nanoid(8);
    let isCodeTaken = await this.urlRepository.findByShortCode(shortCode);
    
    // Simple collision handling
    while (isCodeTaken) {
      shortCode = nanoid(8);
      isCodeTaken = await this.urlRepository.findByShortCode(shortCode);
    }

    return await this.urlRepository.create({
      originalUrl,
      shortCode,
      userId,
    
    });
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
