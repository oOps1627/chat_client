import { createContext, PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { IUser } from "../models/user";
import { ILoginParams, IRegistrationParams } from "../models/auth";
import { httpRequest, HTTPRequestMethod } from "../helpers/request";
import { Observable } from "../helpers/observable";

export interface IAuthProvider {
    readonly user: IUser | null;

    isAuthorized(): boolean;

    subscribeOnAuthorizationChange(handler: (isAuthorized: boolean) => void): () => void;

    initialize(): Promise<void>;

    login(params: ILoginParams): Promise<void>;

    register(params: IRegistrationParams): Promise<void>;

    logout(): Promise<void>;
}

export const AuthProviderContext = createContext<PropsWithChildren<IAuthProvider>>(null as any);

const authorizationObservable: Observable<boolean> = new Observable<boolean>();

export function AuthProvider(props: PropsWithChildren): ReactElement {
    const [user, setUser] = useState<IUser | null>(null);


    const isAuthorized = () => !!user;

    const subscribeOnAuthorizationChange = (handler: (isAuthorized: boolean) => void) => {
        return authorizationObservable.subscribe(handler);
    }

    const initialize = () => {
        return httpRequest<IUser>(`${process.env.REACT_APP_API_HOST}/users/user-info`, {
            method: HTTPRequestMethod.GET,
        }).then((user) => {
            setUser(user);
        })
    }

    const login = (params: ILoginParams): Promise<void> => {
        return httpRequest<IUser>(`${process.env.REACT_APP_API_HOST}/auth/login`, {
            method: HTTPRequestMethod.POST,
            body: params,
        }).then((user) => {
            setUser(user);
        })
    }

    const register = (params: IRegistrationParams): Promise<void> => {
        return httpRequest<void>(`${process.env.REACT_APP_API_HOST}/auth/register`, {
            method: HTTPRequestMethod.POST,
            body: params,
        })
    }

    const logout = (): Promise<any> => {
        return httpRequest<void>(`${process.env.REACT_APP_API_HOST}/auth/logout`, {
            method: HTTPRequestMethod.DELETE,
        }).then(() => {
            setUser(null);
        })
    }

    useEffect(() => {
        authorizationObservable.emit(!!user);
    }, [user])

    return (
        <AuthProviderContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthorized,
            initialize,
            subscribeOnAuthorizationChange
        }}>
            {props.children}
        </AuthProviderContext.Provider>
    )
}
