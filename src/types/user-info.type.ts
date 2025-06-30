import {type User} from './user.type';

export interface UserInfo {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    district?: string;
    ward?: string;
    address?: string;
    user : User;
}


