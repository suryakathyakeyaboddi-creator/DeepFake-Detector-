import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let result;
            if (isLogin) {
                result = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
            } else {
                result = await supabase.auth.signUp({
                    email,
                    password,
                });
            }

            if (result.error) throw result.error;

            if (!isLogin && !result.data.session) {
                setError("Success! Check your email to confirm your account.");
                setIsLogin(true);
            } else {
                // Successful login
                navigate('/profile');
            }

        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100vw',
            background: 'var(--bg-color)',
            margin: 0,
            padding: 0,
            flexDirection: 'row',
            flexWrap: 'wrap' // Allow stacking 
        }}>
            {/* Left Side - Marketing */}
            <div style={{
                flex: '1.5 1 400px', // Takes more space (60%), bumps form closer to center
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(15, 23, 42, 1) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'clamp(2rem, 5vw, 6rem)', // Responsive padding
                minHeight: '400px'
            }}>
                <div style={{ marginBottom: '2rem', maxWidth: '600px', width: '100%', margin: '0 auto 2rem 0' }}>
                    <ShieldCheck color="var(--primary-color)" size={64} />
                </div>
                <div style={{ maxWidth: '600px' }}>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '1.5rem', background: 'white', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                        Welcome to <br /> Human Guard
                    </h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <FeatureItem title="99%+ Accuracy" desc="Industry-leading detection rates across all content types." />
                        <FeatureItem title="Real-time Analysis" desc="Get instant results for images and videos." />
                        <FeatureItem title="Secure & Private" desc="Your data is encrypted and never shared." />
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={{ flex: '1 1 350px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '450px', background: 'var(--surface-color)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{isLogin ? 'Sign In' : 'Create Account'}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        {isLogin ? 'Enter your email and password to access your account' : 'Sign up to get started'}
                    </p>

                    {error && (
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        background: 'rgba(15, 23, 42, 0.5)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        background: 'rgba(15, 23, 42, 0.5)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <button className="btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? <Loader2 className="animate-spin" /> : <>{isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                <ShieldCheck color="var(--primary-color)" size={20} />
            </div>
            <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>{title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{desc}</p>
            </div>
        </div>
    )
}
