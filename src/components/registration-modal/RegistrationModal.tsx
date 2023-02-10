import { ChangeEvent, FormEventHandler, ReactElement, useContext, useState } from "react";
import { AuthProviderContext } from "../../providers/AuthProvider";
import { ILoginParams, IRegistrationParams } from "../../models/auth";

interface IProps {
    show: boolean;
    close: () => void;
}

interface IActionResult {
    text: string;
    success: boolean;
}

export function RegistrationModal(props: IProps): ReactElement {
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
            .catch((error: Response) => {
                setActionResult({success: false, text: error.statusText});
            })
    }

    return (
        <div className={`modal ${props.show  ? 'opened' : ''}`}>
            <button className='close' onClick={props.close}>X</button>

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
        </div>
    )
}
