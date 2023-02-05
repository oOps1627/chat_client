import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import Header from "./components/header/Header";
import Chat from "./components/chat/Chat";
import OnlineList from "./components/online-list/OnlineList";
import AllRooms from "./components/all-rooms/AllRooms";
import MyRooms from "./components/my-rooms/MyRooms";
import { AuthProviderContext, IAuthProvider } from "./providers/AuthProvider";
import { Loader } from "./components/loader/Loader";

function App(): JSX.Element {
    const [initialized, setInitialized] = useState(false);
    const authProvider: IAuthProvider = useContext(AuthProviderContext);

    useEffect(() => {
        authProvider.initialize().then(() => {
            setInitialized(true);
        });
    }, [])

    return (
        <div className="App">
            <AuthProviderContext.Provider value={authProvider}>
                <Header/>
                <div className="content">
                    <Chat/>
                    <div className="menu">
                        <OnlineList/>
                        <MyRooms/>
                        <AllRooms/>
                    </div>
                </div>
            </AuthProviderContext.Provider>

            ${!initialized && <Loader/>}
        </div>
    );
}

export default App;
