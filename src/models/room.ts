import { IUser } from "./user";

export interface IRoom {
    id: string;
    name: string;
    authorId: string;
    members: IUser[];
}

export interface ICreateRoomParams {
    name: string;
}
