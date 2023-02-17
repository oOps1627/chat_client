import './Modal.css';
import { PropsWithChildren, ReactElement } from "react";

export interface IModalProps {
    show: boolean;
    close: () => void;
}

export function Modal(props: IModalProps & PropsWithChildren): ReactElement {
    return (
        <>
            <div className={`modal-overlay ${props.show ? '' : 'hidden'}`} onClick={close} />

            <div className={`modal ${props.show ? 'opened' : ''}`}>
                <button className='close' onClick={props.close}>X</button>

                {props.children}
            </div>
        </>
    )
}
