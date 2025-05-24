import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Nav() {
    const navigate = useNavigate();
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('valid_admin');
        navigate('/login');
    };

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    return (
        <nav className="navbar navbar-expand-lg bg-black shadow-sm px-4 py-3">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand text-white fw-bold fs-4" style={{ letterSpacing: '1px' }}>
                    Admin
                </Link>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    aria-controls="navbarNav"
                    aria-expanded={!isNavCollapsed}
                    aria-label="Toggle navigation"
                    onClick={handleNavCollapse}
                >
                    <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
                </button>
                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button
                                className="btn btn-primary px-4 py-2"
                                style={{ borderRadius: '5px' }}
                                onClick={handleLogout}
                                aria-label="Logout"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
