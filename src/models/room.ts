import { IUser } from "./user";

export interface IRoom {
    name: string;
    authorId: string;
    members: IUser[];
}