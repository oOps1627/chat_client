import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./providers/AuthProvider";
import { UsersProvider } from "./providers/UsersProvider";
import { RealtimeProvider } from "./providers/RealtimeProvider";
import { MessagesProvider } from "./providers/MessagesProvider";
import { RoomsProvider } from "./providers/RoomsProvider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <RealtimeProvider>
        <UsersProvider>
            <AuthProvider>
                <RoomsProvider>
                    <MessagesProvider>
                        <App/>
                    </MessagesProvider>
                </RoomsProvider>
            </AuthProvider>
        </UsersProvider>
    </RealtimeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
