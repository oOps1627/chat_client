import { IReceivedMessage } from "../models/message";
import { IRoom } from "../models/room";

export interface IRoomsProvider {
    readonly currentRoomId?: string;

    getRoomHistory(roomId?: string): IReceivedMessage;

    getAllRooms(): IRoom[];

    getMyRooms(): IRoom[];

    switchCurrentRoom(roomId?: string): IReceivedMessage;
}