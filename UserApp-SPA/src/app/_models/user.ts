import { Picture } from './picture';

export interface User {
    id: number;
    username: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    pictureUrl: string;
    city: string;
    country: string;
    interests?: string;
    introduction?: string;
    pictures?: Picture[];
}
