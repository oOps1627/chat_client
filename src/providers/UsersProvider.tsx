import { IUser } from "../models/user";
import { createContext, PropsWithChildren, ReactElement } from "react";
import { httpRequest, HTTPRequestMethod } from "../helpers/request";

export interface IUsersProvider {
    getOnlineUsers(): Promise<IUser[]>;
}

export const UsersProviderContext = createContext<PropsWithChildren<IUsersProvider>>(null as any);

export function UsersProvider(props: PropsWithChildren): ReactElement {
    const getOnlineUsers = () => {
        return httpRequest<IUser[]>(`${process.env.REACT_APP_API_HOST}/users/online`, {
            method: HTTPRequestMethod.GET
        });
    }

    return (
        <UsersProviderContext.Provider value={{getOnlineUsers}}>
            {props.children}
        </UsersProviderContext.Provider>
    )
}
