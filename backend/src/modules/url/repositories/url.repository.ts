import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUrlRepository } from '../interfaces/url-repository.interface';
import { IUrl } from '../interfaces/url.interface';
import { Url } from '../schemas/url.schema';

@Injectable()
export class UrlRepository implements IUrlRepository {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
  ) {}

  async create(urlData: Partial<IUrl>): Promise<IUrl> {
    const newUrl = new this.urlModel(urlData);
    const savedUrl = await newUrl.save();
    const result = savedUrl.toObject();
    return { ...result, id: result._id.toString() } as IUrl;
  }

  async findByShortCode(shortCode: string): Promise<IUrl | null> {
    const url = await this.urlModel.findOne({ shortCode }).exec();
    if (!url) return null;
    const result = url.toObject();
    return { ...result, id: result._id.toString() } as IUrl;
  }

  async findByOriginalUrl(originalUrl: string, userId?: string): Promise<IUrl | null> {
    const query: Record<string, unknown> = { originalUrl };
    if (userId) query.userId = userId;
    
    const url = await this.urlModel.findOne(query).exec();
    if (!url) return null;
    const result = url.toObject();
    return { ...result, id: result._id.toString() } as IUrl;
  }

  async findAllByUserId(userId: string, skip: number, limit: number): Promise<IUrl[]> {
    const urls = await this.urlModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return urls.map(url => {
      const result = url.toObject();
      return { ...result, id: result._id.toString() } as IUrl;
    });
  }
}
