import { ICreateRoomParams, IRoom } from "../models/room";
import { createContext, PropsWithChildren, ReactElement, useState } from "react";
import { httpRequest, HTTPRequestMethod } from "../helpers/request";

export interface IRoomsProvider {
    readonly currentRoom: IRoom | null;

    getAllRooms(): Promise<IRoom[]>;

    getMyRooms(): Promise<IRoom[]>;

    createRoom(params: ICreateRoomParams): Promise<IRoom>;

    joinRoom(roomId: string): Promise<void>;

    leaveRoom(roomId: string): Promise<void>;

    deleteRoom(roomId: string): Promise<void>;

    switchCurrentRoom(room: IRoom | null): void;
}

export const RoomsProviderContext = createContext<PropsWithChildren<IRoomsProvider>>(null as any);

export function RoomsProvider(props: PropsWithChildren): ReactElement {
    const [activeRoom, setActiveRoom] = useState<IRoom | null>(null);

    const createRoom = (params: ICreateRoomParams) => {
        return httpRequest<IRoom>(`${process.env.REACT_APP_API_HOST}/rooms`, {
            method: HTTPRequestMethod.POST,
            body: params
        })
    }

    const getAllRooms = () => {
        return httpRequest<IRoom[]>(`${process.env.REACT_APP_API_HOST}/rooms`, {
            method: HTTPRequestMethod.GET,
        })
    }

    const getMyRooms = () => {
        return httpRequest<IRoom[]>(`${process.env.REACT_APP_API_HOST}/rooms/my`, {
            method: HTTPRequestMethod.GET,
        })
    }

    const joinRoom = (roomId: string) => {
        return httpRequest<void>(`${process.env.REACT_APP_API_HOST}/rooms/${roomId}/join`, {
            method: HTTPRequestMethod.PUT,
        })
    }

    const leaveRoom = (roomId: string) => {
        return httpRequest<void>(`${process.env.REACT_APP_API_HOST}/rooms/${roomId}/leave`, {
            method: HTTPRequestMethod.PUT,
        })
    }

    const deleteRoom = (roomId: string) => {
        return httpRequest<void>(`${process.env.REACT_APP_API_HOST}/rooms/${roomId}`, {
            method: HTTPRequestMethod.DELETE,
        })
    }

    const switchCurrentRoom = (room: IRoom | null) => setActiveRoom(room)

    return (
        <RoomsProviderContext.Provider value={{
            currentRoom: activeRoom,
            getAllRooms,
            getMyRooms,
            createRoom,
            joinRoom,
            leaveRoom,
            deleteRoom,
            switchCurrentRoom
        }}>
            {props.children}
        </RoomsProviderContext.Provider>
    )
}
