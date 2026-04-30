import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from './repositories/url.repository';
import { Url, UrlSchema } from './schemas/url.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [UrlController],
  providers: [
    UrlService,
    {
      provide: 'URL_REPOSITORY',
      useClass: UrlRepository,
    },
  ],
  exports: [UrlService],
})
export class UrlModule {}
