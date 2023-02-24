import { IUser } from "../models/user";
import { createContext, PropsWithChildren, ReactElement } from "react";
import { restApi } from "../http/http";

export interface IUsersProvider {
    getOnlineUsers(): Promise<IUser[]>;
}

export const UsersProviderContext = createContext<PropsWithChildren<IUsersProvider>>(null as any);

export function UsersProvider(props: PropsWithChildren): ReactElement {
    const getOnlineUsers = () => {
        return restApi.get<IUser[]>(`${process.env.REACT_APP_API_HOST}/users/online`);
    }

    return (
        <UsersProviderContext.Provider value={{getOnlineUsers}}>
            {props.children}
        </UsersProviderContext.Provider>
    )
}
