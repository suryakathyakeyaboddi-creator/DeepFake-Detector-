import { useEffect, useState } from 'react';


import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                navigate('/login');
            } else {
                setUser(user);
                setNewName(user.user_metadata?.full_name || user.email?.split('@')[0]);
            }
        });
    }, [navigate]);

    const handleUpdateProfile = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.updateUser({
            data: { full_name: newName }
        });

        if (!error && data.user) {
            setUser(data.user);
            setEditing(false);
        }
        setLoading(false);
    };

    if (!user) return null;

    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
            <div style={{
                background: 'var(--surface-color)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
            }}>
                {/* Cover */}
                <div style={{ height: '150px', background: 'linear-gradient(90deg, var(--primary-color), #c084fc)' }}></div>

                <div style={{ padding: '0 2rem 2rem', marginTop: '-50px' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: '4px solid var(--surface-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem'
                    }}>
                        👨‍💻
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            {editing ? (
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    style={{
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--border-color)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        padding: '0.25rem 0.5rem',
                                        width: '100%'
                                    }}
                                />
                            ) : (
                                <h1 style={{ margin: 0 }}>{displayName}</h1>
                            )}
                            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>{user.email}</p>
                        </div>

                        {editing ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={handleUpdateProfile} disabled={loading} className="btn" style={{ width: 'auto', padding: '0.5rem 1.5rem', fontSize: '0.9rem', marginTop: 0 }}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button onClick={() => setEditing(false)} className="btn-secondary" style={{ marginTop: 0 }}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing(true)} className="btn" style={{ width: 'auto', padding: '0.5rem 1.5rem', fontSize: '1rem', marginTop: 0 }}>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Analysis History</h2>

                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary-color)', textAlign: 'center' }}>
                                Analysis history coming soon!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// function HistoryItem({ filename, date, status }: { filename: string, date: string, status: string }) {
//     const isFake = status === 'Deepfake';
//     return (
//         <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             padding: '1rem',
//             background: 'rgba(15, 23, 42, 0.4)',
//             borderRadius: '12px',
//             border: '1px solid var(--border-color)'
//         }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                 <div style={{
//                     width: '40px',
//                     height: '40px',
//                     background: isFake ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
//                     borderRadius: '8px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     color: isFake ? 'var(--error-color)' : 'var(--success-color)'
//                 }}>
//                     {isFake ? '⚠️' : '🛡️'}
//                 </div>
//                 <div>
//                     <div style={{ fontWeight: 600 }}>{filename}</div>
//                     <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{date}</div>
//                 </div>
//             </div>
// 
//             <div style={{
//                 padding: '0.25rem 0.75rem',
//                 borderRadius: '99px',
//                 fontSize: '0.85rem',
//                 fontWeight: 600,
//                 background: isFake ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
//                 color: isFake ? 'var(--error-color)' : 'var(--success-color)',
//                 border: `1px solid ${isFake ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
//             }}>
//                 {status}
//             </div>
//         </div>
//     )
// }
