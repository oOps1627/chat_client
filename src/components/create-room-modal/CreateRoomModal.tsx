import './CreateRoomModal.css';
import { IModalProps, Modal } from "../modal/Modal";
import { ChangeEvent, FormEventHandler, ReactElement, useContext, useState } from "react";
import { getErrorMessage, IHTTPErrorResponse } from "../../helpers/error-response";
import { ICreateRoomParams, IRoom } from "../../models/room";
import { IRoomsProvider, RoomsProviderContext } from "../../providers/RoomsProvider";

const initialFormState: ICreateRoomParams = {
    name: ''
}

export function CreateRoomModal(props: IModalProps): ReactElement {
    const roomsProvider: IRoomsProvider = useContext(RoomsProviderContext);

    const [formData, setFormData] = useState<ICreateRoomParams>(initialFormState);

    const handleChange = (params: Partial<ICreateRoomParams>): void => {
        setFormData({...formData, ...params});
    }

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        roomsProvider.createRoom(formData)
            .then((room: IRoom) => {
                setFormData(initialFormState);
                props.close();
            })
            .catch((error: IHTTPErrorResponse) => {
                console.error(getErrorMessage(error));
            })
    }


    return (
        <Modal show={props.show} close={props.close}>
            <form onSubmit={handleSubmit}>
                <input type="text"
                       placeholder="Room name"
                       value={formData.name}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange({name: event.target.value})}/>

                <input type="submit" value="Create"/>
            </form>
        </Modal>
    )
}
