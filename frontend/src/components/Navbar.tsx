import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Home, ScanLine, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/')
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem', // Reduced padding
            background: 'rgba(30, 41, 59, 0.8)', // More opacity for mobile readibility
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '2rem',
            flexWrap: 'wrap', // Allow wrapping on very small screens if needed
            gap: '1rem'
        }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck color="var(--primary-color)" size={32} />
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-color)', letterSpacing: '-0.02em' }}>
                    Human Guard
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <NavLink to="/" icon={<Home size={20} />} text="Home" active={isActive('/')} />
                <NavLink to="/detect" icon={<ScanLine size={20} />} text="Detector" active={isActive('/detect')} />

                {session ? (
                    <>
                        <NavLink to="/profile" icon={<User size={20} />} text="Profile" active={isActive('/profile')} />
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </>
                ) : (
                    <NavLink to="/login" icon={<User size={20} />} text="Login" active={isActive('/login')} />
                )}
            </div>
        </nav>
    );
}

function NavLink({ to, icon, text, active }: { to: string, icon: React.ReactNode, text: string, active: boolean }) {
    return (
        <Link to={to} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: active ? 700 : 500,
            transition: 'color 0.2s',
            padding: '0.5rem' // Increase touch target
        }}>
            {icon}
            <span className="nav-text">{text}</span>
        </Link>
    )
}
