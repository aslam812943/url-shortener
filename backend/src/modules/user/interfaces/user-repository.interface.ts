import {IUser} from './user.interface';


export interface IUserRepository{
    create(user:IUser):Promise<IUser>
    findByEmail(email:string):Promise<IUser | null>
}