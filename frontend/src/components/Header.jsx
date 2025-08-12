import { Link } from 'react-router-dom';
import logoImage from '../images/image-audio-transcription-banner.webp';

export default function Header({ isLoggedIn, onLogout }) {
    return (
        <header>
            <div className="header-left">
                <Link to="/" className="home-link">
                    <img src={logoImage} alt="Audio Transcription Logo" className="logo" />
                    <h1>Project Assistant Position Online Assessment</h1>
                </Link>
            </div>
        </header>
    )
}