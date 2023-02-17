import './Room.css';
import { MouseEvent, PropsWithChildren, ReactElement } from "react";
import { IRoom } from "../../models/room";

interface IRoomProps extends PropsWithChildren {
    room: IRoom;
    isActive: boolean;
    canDelete: boolean;
    canLeave: boolean;
    canJoin: boolean;
    onClick: (room: IRoom) => void;
    onDelete: (room: IRoom) => void;
    onJoin: (room: IRoom) => void;
    onLeave: (room: IRoom) => void;
}

export function Room(props: IRoomProps): ReactElement {
    const emitDelete = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        props.onDelete(props.room);
    }

    const emitLeave = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        props.onLeave(props.room);
    }

    const emitJoin = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        props.onJoin(props.room);
    }

    return (
        <div className='room' onClick={() => props.onClick(props.room)}>
            {props.room.name}

           <div className="room-actions">
               <button hidden={!props.canDelete} onClick={(e) => emitDelete(e)}>Delete</button>
               <button hidden={!props.canJoin} onClick={(e) => emitJoin(e)}>Join</button>
               <button hidden={!props.canLeave} onClick={(e) => emitLeave(e)}>Leave</button>
           </div>
        </div>
    )
}
