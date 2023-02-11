import './LoginModal.css';
import { ChangeEvent, FormEventHandler, ReactElement, useContext, useState } from "react";
import { AuthProviderContext, IAuthProvider } from "../../providers/AuthProvider";
import { ILoginParams } from "../../models/auth";
import { getErrorMessage, IHTTPErrorResponse } from "../../helpers/error-response";

interface IProps {
    show: boolean;
    close: () => void;
}

interface IActionResult {
    text: string;
    success: boolean;
}

function LoginModal(props: IProps): ReactElement {
    const authProvider: IAuthProvider = useContext(AuthProviderContext);

    const [formData, setFormData] = useState<ILoginParams>({
        username: '',
        password: ''
    });

    const [actionResult, setActionResult] = useState<IActionResult | null>(null);

    const handleChange = (params: Partial<ILoginParams>): void => {
        setFormData({...formData, ...params});
    }

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        authProvider.login(formData)
            .then(() => {
                setActionResult({success: true, text: 'You successfully login'});
                setTimeout(() => {
                    props.close();
                    setActionResult(null);
                }, 1000);
            })
            .catch((error: IHTTPErrorResponse) => {
                setActionResult({success: false, text: getErrorMessage(error)});
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

                <input type="submit" value="Sign-in"/>

                <div className={`status-message ${actionResult?.success ? 'success' : 'error'}`}
                     hidden={!actionResult}>{actionResult?.text}
                </div>
            </form>
        </div>
    )
}

export default LoginModal;
