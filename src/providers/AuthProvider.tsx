import { createContext, PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { IUser } from "../models/user";
import { ILoginParams, IRegistrationParams } from "../models/auth";
import { Observable } from "../helpers/observable";
import { restApi } from "../http/http";
import { SKIP_REFRESH_TOKEN_INTERCEPTOR_HEADER } from "../interceptors/refresh-token.interceptor";

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
        return restApi.get<IUser>(`${process.env.REACT_APP_API_HOST}/users/user-info`).then((user) => {
            setUser(user);
        })
    }

    const login = (params: ILoginParams): Promise<void> => {
        return restApi.post<IUser>(`${process.env.REACT_APP_API_HOST}/auth/login`, {
            body: params,
            headers: {[SKIP_REFRESH_TOKEN_INTERCEPTOR_HEADER]: 'true'}
        }).then((user) => {
            setUser(user);
        })
    }

    const register = (params: IRegistrationParams): Promise<void> => {
        return restApi.post<void>(`${process.env.REACT_APP_API_HOST}/auth/register`, {
            body: params,
            headers: {[SKIP_REFRESH_TOKEN_INTERCEPTOR_HEADER]: 'true'}
        })
    }

    const logout = (): Promise<any> => {
        return restApi.delete<void>(`${process.env.REACT_APP_API_HOST}/auth/logout`).then(() => {
            setUser(null);
        })
    }

    const refreshToken = (): Promise<any> => {
        return restApi.post<void>(`${process.env.REACT_APP_API_HOST}/auth/refresh`, {
            headers: {[SKIP_REFRESH_TOKEN_INTERCEPTOR_HEADER]: 'true'}
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
