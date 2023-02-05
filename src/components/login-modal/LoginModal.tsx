import './LoginModal.css';
import { ChangeEvent, FormEvent, FormEventHandler, ReactElement, useContext, useState } from "react";
import { AuthProviderContext } from "../../providers/AuthProvider";
import { ILoginParams } from "../../models/auth";


interface IProps {
    show: boolean;
    close: () => void;
}

function LoginModal(props: IProps): ReactElement {
    const authProvider = useContext(AuthProviderContext);
    const [loginParams, setLoginParams] = useState({
        username: '',
        password: ''
    } as ILoginParams);

    const handleChange = (params: Partial<ILoginParams>): void => {
        setLoginParams({...loginParams, ...params});
    }

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        authProvider.login(loginParams).then(() => props.close());
    }

    return (
        <div className={`modal ${props.show  ? 'opened' : ''}`}>
            <button onClick={props.close}>X</button>

            <form onSubmit={handleSubmit}>
                <input type="text"
                       placeholder="Username"
                       value={loginParams.username}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange({username: event.target.value})}/>

                <input type="password"
                       placeholder="Password"
                       value={loginParams.password}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange({password: event.target.value})}
                />

                <input type="submit" value="Login"/>
            </form>
        </div>
    )
}

export default LoginModal;
