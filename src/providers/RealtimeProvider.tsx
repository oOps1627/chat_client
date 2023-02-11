import { createContext, PropsWithChildren, ReactElement, useMemo } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client/build/esm/socket";
import { Observable } from "../helpers/observable";

export enum RealtimeEvent {
    UserConnected = 'UserConnected',
    UserDisconnected = 'UserDisconnected',
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

const observablesMap: {[key in RealtimeEvent]: Observable} = {
    [RealtimeEvent.UserConnected]: new Observable(),
    [RealtimeEvent.UserDisconnected]: new Observable(),
}

export function RealtimeProvider(props: PropsWithChildren): ReactElement {
    let socket: Socket;

    let isConnected = false;

    const connect = () => {
        if (isConnected)
            return;

        const socket = io({transports:['websocket']});

        Object.keys(observablesMap).forEach((event) => {
            socket.on(event, (data) => {
                observablesMap[event as RealtimeEvent].emit(data);
            });
        });

        isConnected = true;
    }

    const disconnect = () => {
        socket.disconnect();
        isConnected = false;
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

