import { ICreateRoomParams, IRoom } from "../models/room";
import { createContext, PropsWithChildren, ReactElement, useState } from "react";
import { restApi } from "../http/http";

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
        return restApi.post<IRoom>(`${process.env.REACT_APP_API_HOST}/rooms`, {
            body: params
        })
    }

    const getAllRooms = () => {
        return restApi.get<IRoom[]>(`${process.env.REACT_APP_API_HOST}/rooms`)
    }

    const getMyRooms = () => {
        return restApi.get<IRoom[]>(`${process.env.REACT_APP_API_HOST}/rooms/my`)
    }

    const joinRoom = (roomId: string) => {
        return restApi.put<void>(`${process.env.REACT_APP_API_HOST}/rooms/${roomId}/join`)
    }

    const leaveRoom = (roomId: string) => {
        return restApi.put<void>(`${process.env.REACT_APP_API_HOST}/rooms/${roomId}/leave`)
    }

    const deleteRoom = (roomId: string) => {
        return restApi.delete<void>(`${process.env.REACT_APP_API_HOST}/rooms/${roomId}`)
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
