import './TextInput.css';
import { ChangeEvent, FormEvent, ReactElement, useContext, useState } from "react";
import { IMessagesProvider, MessagesProviderContext } from "../../providers/MessagesProvider";
import { IRoomsProvider, RoomsProviderContext } from "../../providers/RoomsProvider";

export function TextInput(): ReactElement {
    const messagesProvider: IMessagesProvider = useContext(MessagesProviderContext);
    const roomsProvider: IRoomsProvider = useContext(RoomsProviderContext);

    const [text, setText] = useState<string>('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        messagesProvider.sendMessage({text, roomId: roomsProvider.currentRoom?.id});
        setText('');
    }

    return (
        <>
            <form className="input-form" onSubmit={(event) => handleSubmit(event)}>
                <input type="text"
                       value={text}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
                />
            </form>
        </>
    )
}
