import './TextInput.css';
import { ChangeEvent, ReactElement, useContext, useState } from "react";
import { IRealtimeProvider, RealtimeEvent, RealtimeProviderContext } from "../../providers/RealtimeProvider";
import { ISentMessage } from "../../models/message";

export function TextInput(): ReactElement {
    const realtimeProvider: IRealtimeProvider = useContext(RealtimeProviderContext);

    const [text, setText] = useState<string>('');

    const handleSubmit = () => {
        realtimeProvider.emitEvent<ISentMessage>(RealtimeEvent.NewMessage, {
            text: text
        })
    }

    return (
        <>
            <form className="input-form" onSubmit={handleSubmit}>
                <input type="text"
                       value={text}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
                />
            </form>
        </>
    )
}