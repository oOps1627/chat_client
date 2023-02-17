import { ReactElement, useContext, useEffect, useState } from "react";
import './Chat.css';
import { TextInput } from "../text-input/TextInput";
import { IMessagesProvider, MessagesProviderContext } from "../../providers/MessagesProvider";
import { IReceivedMessage } from "../../models/message";
import { IRoomsProvider, RoomsProviderContext } from "../../providers/RoomsProvider";

function Chat(): ReactElement {
    const messagesProvider: IMessagesProvider = useContext(MessagesProviderContext);
    const roomsProvider: IRoomsProvider = useContext(RoomsProviderContext);
    const currentRoomId = roomsProvider.currentRoom?.id;

    const [messages, setMessages] = useState<IReceivedMessage[]>([]);

    useEffect(() => {
        messagesProvider.getMessages(currentRoomId).then((m) => {
            setMessages(m);
        });
    }, [roomsProvider.currentRoom]);

    useEffect(() => {
        return messagesProvider.onNewMessage.subscribe((message) => {
            if (currentRoomId == message.roomId) {
                setMessages([...messages, message]);
            }
        })
    })

    return (
        <div className="Chat__wrapper">
            <div className="Chat__channel-info">
                <div hidden={!roomsProvider.currentRoom}>
                    <span>You in room "{roomsProvider.currentRoom?.name}"</span>
                    <button onClick={() => roomsProvider.switchCurrentRoom(null)}>Switch to shared channel</button>
                </div>
                <span hidden={!!roomsProvider.currentRoom}>  You in shared channel </span>
            </div>

            <div className="Chat__container">
                {
                    messages.map(message => <div className='Chat__message'>
                        <i className='date'>{new Date(message.date).toISOString()}</i>
                        <b className='author'>{message.authorUsername}</b>
                        <div className='text'>
                            {message.text}
                        </div>
                    </div>)
                }
            </div>
            <TextInput/>
        </div>
    )
}

export default Chat;
