import './Header.css';
import { ReactElement, useContext, useState } from "react";
import { AuthProviderContext, IAuthProvider } from "../../providers/AuthProvider";
import LoginModal from "../login-modal/LoginModal";
import { RegistrationModal } from "../registration-modal/RegistrationModal";

function Header(): ReactElement {
    const authProvider: IAuthProvider = useContext(AuthProviderContext);
    const isAuthorized = authProvider.isAuthorized();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);

    return (
        <nav className="Header__navbar">
            <img className='Header__logo' src='./images/logo.png' alt="Logo"/>

            <div className='Header__navbar-right-side'>

                <span className='Header__greeting' hidden={!isAuthorized}>
                    Hello, {authProvider.user?.username}
                </span>

                <button className="Header__button"
                        hidden={isAuthorized}
                        onClick={() => setShowRegistrationModal(true)}>
                    Sign-up
                </button>

                <button className="Header__button"
                        hidden={isAuthorized}
                        onClick={() => setShowLoginModal(true)}>
                    Sign-in
                </button>

                <button className="Header__button"
                        hidden={!isAuthorized}
                        onClick={() => authProvider.logout()}>
                    Logout
                </button>
            </div>

            <LoginModal show={showLoginModal} close={() => setShowLoginModal(false)}/>
            <RegistrationModal show={showRegistrationModal} close={() => setShowRegistrationModal(false)}/>
        </nav>
    )
}

export default Header;
