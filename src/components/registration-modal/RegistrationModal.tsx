import { ChangeEvent, FormEventHandler, ReactElement, useContext, useState } from "react";
import { AuthProviderContext } from "../../providers/AuthProvider";
import { ILoginParams, IRegistrationParams } from "../../models/auth";
import { getErrorMessage, IHTTPErrorResponse } from "../../helpers/error-response";
import { IModalProps, Modal } from "../modal/Modal";

interface IActionResult {
    text: string;
    success: boolean;
}

export function RegistrationModal(props: IModalProps): ReactElement {
    const authProvider = useContext(AuthProviderContext);

    const [formData, setFormData] = useState<IRegistrationParams>({
        username: '',
        password: ''
    });

    const [actionResult, setActionResult] = useState<IActionResult | null>(null);

    const handleChange = (params: Partial<ILoginParams>): void => {
        setFormData({...formData, ...params});
    }

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        authProvider.register(formData)
            .then(() => {
                setActionResult({success: true, text: 'You successfully registered'});
                setTimeout(() => props.close(), 1000);
            })
            .catch(async (error: IHTTPErrorResponse) => {
                setActionResult({success: false, text: getErrorMessage(error)});
            })
    }

    return (
        <Modal close={props.close} show={props.show}>
            <form onSubmit={handleSubmit}>
                <input type="text"
                       placeholder="Username"
                       value={formData.username}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange({username: event.target.value})}/>

                <input type="password"
                       placeholder="Password"
                       value={formData.password}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange({password: event.target.value})}
                />

                <input type="submit" value="Sign-up"/>

                <div className={`status-message ${actionResult?.success ? 'success' : 'error'}`}
                     hidden={!actionResult}>{actionResult?.text}
                </div>
            </form>
        </Modal>
    )
}
