import './Rooms.css';
import { PropsWithChildren, ReactElement, useContext } from "react";
import { IRoom } from "../../models/room";
import { Room } from "../room/Room";
import { IRoomsProvider, RoomsProviderContext } from "../../providers/RoomsProvider";

interface IRoomsProps extends PropsWithChildren {
    title: string;
    rooms: IRoom[];
    canJoin: (room: IRoom) => boolean;
    canLeave: (room: IRoom) => boolean;
    canDelete: (room: IRoom) => boolean;
}

export function Rooms(props: IRoomsProps): ReactElement {
    const roomsProvider: IRoomsProvider = useContext(RoomsProviderContext);

    const isRoomActive = (room: IRoom) => room.id === roomsProvider.currentRoom?.id;

    const changeCurrentRoom = (room: IRoom) => roomsProvider.switchCurrentRoom(room);

    const joinRoom = (room: IRoom) => {
        roomsProvider.joinRoom(room.id).then();
    }

    const leaveRoom = (room: IRoom) => {
        roomsProvider.leaveRoom(room.id).then();
    }

    const deleteRoom = (room: IRoom) => {
        roomsProvider.deleteRoom(room.id).then();
    }

    return (
        <div className="Rooms__container">
            <span className='Rooms__title'>{props.title}</span>

            <div className="rooms">
                {
                    props.rooms.map((room) => <Room
                        room={room}
                        canJoin={props.canJoin(room)}
                        canLeave={props.canLeave(room)}
                        canDelete={props.canDelete(room)}
                        onJoin={joinRoom}
                        onLeave={leaveRoom}
                        onDelete={deleteRoom}
                        onClick={changeCurrentRoom}
                        isActive={isRoomActive(room)}/>)
                }
            </div>

            {props.children}
        </div>
    )
}
