import { ReactElement } from "react";
import './Chat.css';
import { TextInput } from "../text-input/TextInput";

function Chat(): ReactElement {
    return (
        <div className="Chat__wrapper">
            <div className="Chat__container">

            </div>
            <TextInput/>
        </div>
    )
}

export default Chat;
