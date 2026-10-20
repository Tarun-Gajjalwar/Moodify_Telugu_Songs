import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router';
import './navbar.scss';

export default function Navbar() {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    async function onLogout() {
        await handleLogout();
        navigate('/login');
    }

    return (
        <header className="navbar">
            <div className="navbar__brand">
                🎵 Mood<span>ify</span>
            </div>

            <div className="navbar__user-section">
                {user && (
                    <span className="navbar__username">
                        Welcome, <b>{user.username}</b>
                    </span>
                )}
                <button
                    className="navbar__logout-btn"
                    onClick={onLogout}
                    type="button"
                    title="Logout"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}
