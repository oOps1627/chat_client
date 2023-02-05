import { createContext, PropsWithChildren, useState } from "react";
import { IUser } from "../models/user";
import { ILoginParams, IRegisterParams } from "../models/auth";

export interface IAuthProvider {
    readonly user: IUser | null;

    initialize(): Promise<void>;

    isAuthorized(): boolean;

    login(params: ILoginParams): Promise<any>;

    register(params: IRegisterParams): Promise<any>;

    logout(): Promise<void>;
}

export const AuthProviderContext = createContext<PropsWithChildren<IAuthProvider>>(null as any);

export const AuthProvider = (props: PropsWithChildren) => {
    const [user, setUser] = useState<IUser | null>(null);

    const initialize = () => {
        return fetch('http://localhost:3000/users/user-info', {
            method: 'GET',
            headers: {['Content-Type']: 'application/json'},
        }).then(async (res: Response) => {
            try {
                const user: IUser = await res.json();
                setUser(user);
            } catch (error) {
                console.error(error);
                setUser(null);
            }

        })
    }

    const isAuthorized = () => !!user;

    const login = (params: ILoginParams): Promise<any> => {
        return fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {['Content-Type']: 'application/json'},
            body: JSON.stringify(params),
        }).then(() => {
            setUser({username: params.username});
        })
    }

    const register = (params: IRegisterParams): Promise<any> => {
        return fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {['Content-Type']: 'application/json'},
            body: JSON.stringify(params),
        }).then(() => {
            setUser({username: params.username});
        })
    }

    const logout = (): Promise<any> => {
        return fetch('http://localhost:3000/auth/logout', {
            method: 'DELETE',
            headers: {['Content-Type']: 'application/json'},
        }).then(() => {
            setUser(null);
        })
    }

    return (
        <AuthProviderContext.Provider value={{user, login, register, logout, isAuthorized, initialize}}>
            {props.children}
        </AuthProviderContext.Provider>
    )
}
