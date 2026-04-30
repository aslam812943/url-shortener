import { Controller, Post, Get, Body, Param, Res, HttpStatus, UseGuards, Req, Query } from '@nestjs/common';
import type { Response } from 'express';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('url/shorten')
  @UseGuards(JwtAuthGuard)
  async shorten(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: any
  ) {
   
    createUrlDto.userId = req.user.userId;
    return await this.urlService.shortenUrl(createUrlDto);
  }

  @Get('url/my-links')
  @UseGuards(JwtAuthGuard)
  async getMyLinks(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.urlService.getUserUrls(req.user.userId, page, limit);
  }

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response
  ) {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);
    
    
    const redirectUrl = originalUrl.startsWith('http') 
      ? originalUrl 
      : `https://${originalUrl}`;
      
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, redirectUrl);
  }
}
