import './MyRooms.css';
import { ReactElement, useContext, useEffect, useState } from "react";
import { Rooms } from "../rooms/Rooms";
import { IRoomsProvider, RoomsProviderContext } from "../../providers/RoomsProvider";
import { IRoom } from "../../models/room";
import { CreateRoomModal } from "../create-room-modal/CreateRoomModal";
import { AuthProviderContext, IAuthProvider } from "../../providers/AuthProvider";
import { IRealtimeProvider, RealtimeEvent, RealtimeProviderContext } from "../../providers/RealtimeProvider";

function MyRooms(): ReactElement {
    const authProvider: IAuthProvider = useContext(AuthProviderContext);
    const roomsProvider: IRoomsProvider = useContext(RoomsProviderContext);
    const realtimeProvider: IRealtimeProvider = useContext(RealtimeProviderContext);

    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [isCreationActive, setIsCreationActive] = useState<boolean>(false);

    const onRoomDeleted = (roomId: string) => {
        setRooms(rooms.filter(room => room.id !== roomId));
    }

    const onRoomCreated = (room: IRoom) => {
        setRooms([...rooms, room]);
    }

    useEffect(() => {
        realtimeProvider.subscribeOnEvent(RealtimeEvent.RoomCreated, onRoomCreated);

        return realtimeProvider.unsubscribeFromEvent(RealtimeEvent.RoomCreated, onRoomCreated);
    });

    useEffect(() => {
        realtimeProvider.subscribeOnEvent(RealtimeEvent.RoomDeleted, onRoomDeleted);

        return realtimeProvider.unsubscribeFromEvent(RealtimeEvent.RoomDeleted, onRoomDeleted);
    });

    useEffect(() => {
        roomsProvider.getMyRooms().then((rooms: IRoom[]) => setRooms(rooms));
    }, [])

    return (
        <>
            <Rooms rooms={rooms}
                   title='My rooms'
                   canLeave={(room) => room.authorId !== authProvider.user?.id}
                   canDelete={(room) => room.authorId === authProvider.user?.id}
                   canJoin={() => false}>
                <button className='MyRooms__button' onClick={() => setIsCreationActive(true)}>Create room</button>
            </Rooms>

            <CreateRoomModal show={isCreationActive} close={() => setIsCreationActive(false)}/>
        </>
    )
}

export default MyRooms;
