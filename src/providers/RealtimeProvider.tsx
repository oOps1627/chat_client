import { createContext, PropsWithChildren, ReactElement, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client/build/esm/socket";
import { Observable } from "../helpers/observable";

export enum RealtimeEvent {
    UserConnected = "UserConnected",
    UserDisconnected = "UserDisconnected",
    NewMessage = 'NewMessage',
    RoomCreated = 'RoomCreated',
    RoomDeleted = 'RoomDeleted',
    UserJoinedRoom = 'UserJoinedRoom',
    UserLeaveRoom = 'UserLeaveRoom',
}

export interface IRealtimeProvider {
    readonly isConnected: boolean;

    subscribeOnEvent<T = unknown>(event: RealtimeEvent, handler: (data: T) => void): void;

    unsubscribeFromEvent<T = unknown>(event: RealtimeEvent, handler: (data: T) => void): void;

    emitEvent<T = unknown>(event: RealtimeEvent, data: T): void;

    connect(): void;

    disconnect(): void;
}

export const RealtimeProviderContext = createContext<PropsWithChildren<IRealtimeProvider>>(null as any);

const observablesMap = Object.keys(RealtimeEvent).reduce((acc, event) => {
    return {...acc, [event]: new Observable()}
}, {}) as { [key in RealtimeEvent]: Observable }

let socket: Socket;

export function RealtimeProvider(props: PropsWithChildren): ReactElement {
    const [isConnected, setIsConnected] = useState(false);

    const connect = () => {
        if (isConnected)
            return;

        socket = io({transports: ['websocket']});

        Object.keys(observablesMap).forEach((event) => {
            socket.on(event, (data) => {
                observablesMap[event as RealtimeEvent].emit(data);
            });
        });

        setIsConnected(true);
    }

    const disconnect = () => {
        socket.disconnect();
        setIsConnected(false);
    }

    const subscribeOnEvent = (event: RealtimeEvent, handler: (data?: any) => void) => {
        observablesMap[event].subscribe(handler);
    }

    const unsubscribeFromEvent = (event: RealtimeEvent, handler: (data?: any) => void) => {
        observablesMap[event].unsubscribe(handler);
    }

    const emitEvent = (event: RealtimeEvent, data?: unknown) => {
        socket.emit(event, data);
    }

    return (
        <RealtimeProviderContext.Provider
            value={{
                subscribeOnEvent,
                unsubscribeFromEvent,
                emitEvent,
                connect,
                disconnect,
                isConnected
            }}>
            {props.children}
        </RealtimeProviderContext.Provider>
    )
}

