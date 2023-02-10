import { ReactElement, useContext, useEffect, useState } from "react";
import './OnlineList.css';
import { IUsersProvider, UsersProviderContext } from "../../providers/UsersProvider";
import { IUser } from "../../models/user";

function OnlineList(): ReactElement {
    const usersProvider: IUsersProvider = useContext(UsersProviderContext);
    const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);

    useEffect(() => {
        usersProvider.getOnlineUsers()
            .then((users) => setOnlineUsers(users))
            .catch((error) => console.error(error))
    }, []);

    return (
        <div className="OnlineList__container">
            <span className='OnlineList__title'>Online:</span>

            {
                onlineUsers.map((user) => <div className='OnlineList__user'>{user.username}</div>)
            }
        </div>
    )
}

export default OnlineList;
