import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            <div className="header-left">
                <Link to="/" className="home-link">
                    <h1>Project Assistant Position Online Assessment</h1>
                </Link>
            </div>
            <div className="actions">
                <Link to="/" className="btn btn--secondary">Home</Link>
                <Link to="/signin" className="btn btn--secondary">Log in</Link>
                <Link to="/signup" className="btn btn--primary">Sign up</Link>
            </div>
        </header>
    )
}