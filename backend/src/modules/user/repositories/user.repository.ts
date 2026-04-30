import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { User } from '../schemas/user.schemas';
import { IUser } from '../interfaces/user.interface';
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(user: IUser): Promise<IUser> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.userModel.findOne({ email }).exec();
  }
}