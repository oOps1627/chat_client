import { ReactElement, useContext, useEffect, useState } from "react";
import './OnlineList.css';
import { IUsersProvider, UsersProviderContext } from "../../providers/UsersProvider";
import { IUser } from "../../models/user";
import { IRealtimeProvider, RealtimeEvent, RealtimeProviderContext } from "../../providers/RealtimeProvider";
import { AuthProviderContext, IAuthProvider } from "../../providers/AuthProvider";

function OnlineList(): ReactElement {
    const usersProvider: IUsersProvider = useContext(UsersProviderContext);
    const authProvider: IAuthProvider = useContext(AuthProviderContext);
    const realtimeProvider: IRealtimeProvider = useContext(RealtimeProviderContext);
    const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
    const isAuthorized = authProvider.isAuthorized();

    useEffect(() => {
        const onUserConnected = (user: IUser) => setOnlineUsers([...onlineUsers, user]);
       realtimeProvider.subscribeOnEvent<IUser>(RealtimeEvent.UserConnected, onUserConnected);

       return realtimeProvider.unsubscribeFromEvent(RealtimeEvent.UserConnected, onUserConnected);
    })

    useEffect(() => {
        const onUserDisconnected = (user: IUser) => setOnlineUsers(onlineUsers.filter(i => i.id !== user.id));
        realtimeProvider.subscribeOnEvent<IUser>(RealtimeEvent.UserDisconnected, onUserDisconnected);

        return realtimeProvider.unsubscribeFromEvent(RealtimeEvent.UserDisconnected, onUserDisconnected);
    })

    useEffect(() => {
        usersProvider.getOnlineUsers()
            .then((users) => setOnlineUsers(users))
            .catch((error) => console.error(error))


    }, []);

    return (
        <div className="OnlineList__container">
            <span className='OnlineList__title'>Online:</span>
            <div hidden={isAuthorized} className='OnlineList__alert'>
                You need to login to have access to view online users
            </div>
            <div hidden={!isAuthorized}>
                {
                    onlineUsers.map((user) => <div className='OnlineList__user'>{user.username}</div>)
                }
            </div>
        </div>
    )
}

export default OnlineList;
