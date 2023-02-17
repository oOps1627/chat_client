import { Observable } from "../helpers/observable";
import { IReceivedMessage, ISentMessage } from "../models/message";
import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useState } from "react";
import { IRealtimeProvider, RealtimeEvent, RealtimeProviderContext } from "./RealtimeProvider";
import { httpRequest, HTTPRequestMethod } from "../helpers/request";

export interface IMessagesProvider {
    readonly onNewMessage: Observable<IReceivedMessage>;

    sendMessage(message: ISentMessage): void;

    getMessages(roomId?: string): Promise<IReceivedMessage[]>;
}

type CachedMessagesDictionary = {[roomId: string]: IReceivedMessage[]};

export const MessagesProviderContext = createContext<PropsWithChildren<IMessagesProvider>>(null as any);
const onNewMessage = new Observable<IReceivedMessage>();

const defaultRoomId = '___DefaultChannel';

export function MessagesProvider(props: PropsWithChildren): ReactElement {
    const realtimeProvider: IRealtimeProvider = useContext(RealtimeProviderContext);

    const [cachedMessages, setCachedMessages] = useState<CachedMessagesDictionary>({});

    const sendMessage = (message: ISentMessage) => {
        realtimeProvider.emitEvent(RealtimeEvent.NewMessage, message);
    }

    useEffect(() => {
        const handler = (message: IReceivedMessage) => {
            onNewMessage.emit(message);
            const key = message.roomId ?? defaultRoomId;
            setCachedMessages({...cachedMessages, [key]: [...(cachedMessages[key] ?? []), message]});
        }

        realtimeProvider.subscribeOnEvent(RealtimeEvent.NewMessage, handler);
        return () => realtimeProvider.unsubscribeFromEvent(RealtimeEvent.NewMessage, handler);
    }, [])

    const getMessages = (roomId?: string): Promise<IReceivedMessage[]> => {
       const key = roomId ?? defaultRoomId;
       const alreadyLoaded = !!cachedMessages[key];

       if (alreadyLoaded) {
           return new Promise((resolve) => resolve(cachedMessages[key]));
       }

       return loadMessages(roomId);
    }

    const loadMessages = (roomId?: string): Promise<IReceivedMessage[]> => {
        return httpRequest<IReceivedMessage[]>(`${process.env.REACT_APP_API_HOST}/messages`, {
            method: HTTPRequestMethod.GET,
            queryParams: roomId ? {roomId} : undefined
        }).then((messages) => {
            const key = roomId ?? defaultRoomId;
            setCachedMessages({...cachedMessages, [key]: messages});

            return messages;
        })
    };

    return (
        <MessagesProviderContext.Provider value={{onNewMessage, sendMessage, getMessages}}>
            {props.children}
        </MessagesProviderContext.Provider>
    )
}
