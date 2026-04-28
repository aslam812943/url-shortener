import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UserModule, MongooseModule.forRoot('mongodb://localhost:27017/url-shortener')],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
