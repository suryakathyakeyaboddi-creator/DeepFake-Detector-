import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Eye } from 'lucide-react';

export default function Home() {
    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '6rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(192, 132, 252, 0.2) 100%)',
                    padding: '0.5rem 1rem',
                    borderRadius: '99px',
                    color: 'var(--primary-color)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                }}>
                    ✨ Advanced AI Detection 2.0
                </div>

                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '900px' }}>
                    Verify Reality in the <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>Age of AI</span>
                </h1>

                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
                    Protect yourself and your organization from deepfakes, AI-generated images, and manipulated media with our state-of-the-art detection engine.
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/detect" className="btn" style={{
                        width: 'auto',
                        textDecoration: 'none',
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        marginTop: 0
                    }}>
                        Start Detection
                    </Link>
                    <a href="#samples" className="btn-secondary" style={{ width: 'auto', fontSize: '1.2rem', textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                        Check Samples
                    </a>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '0 1rem' }}>
                <FeatureCard
                    icon={<Zap size={32} color="#f59e0b" />}
                    title="Instant Analysis"
                    desc="Get results in seconds. Our optimized engine processes images with lightning speed so you don't have to wait."
                />
                <FeatureCard
                    icon={<Shield size={32} color="#10b981" />}
                    title="80%+ Accuracy"
                    desc="Powered by deep learning models (MobileNetV3 + Classical ML (SGD / SVM)) trained on Thousands of real and fake human samples to minimize false positives."
                />
                <FeatureCard
                    icon={<Eye size={32} color="#6366f1" />}
                    title="Privacy First"
                    desc="We process your images securely. Your data is never shared with third parties or used for training without consent."
                />
            </section>

            {/* Prediction Results Gallery */}
            <section id="samples" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                    color: 'var(--primary-color)',
                    marginBottom: '1rem',
                    fontWeight: 700
                }}>
                    Prediction Results
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    Sample prediction results produced by our deepfake detection model
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    overflowX: 'auto',
                    padding: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <SampleCard img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" status="Real" />
                    <SampleCard img="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop" status="Deepfake" />
                    <SampleCard img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" status="Real" />
                    <SampleCard img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" status="Real" />
                    <SampleCard img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" status="Deepfake" />
                </div>
            </section>

            {/* Stats Section */}
            <section style={{
                marginTop: '6rem',
                background: 'var(--surface-color)',
                borderRadius: '24px',
                padding: '4rem 2rem',
                textAlign: 'center',
                border: '1px solid var(--border-color)'
            }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '3rem' }}>Trusted by Industry Leaders</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
                    <Stat number="100k+" label="Images Analyzed" />
                    <Stat number="50k+" label="Protected Users" />
                    <Stat number="89.9%" label="Uptime" />
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '2rem',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            transition: 'transform 0.3s ease'
        }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
        </div>
    )
}

function SampleCard({ img, status }: { img: string, status: 'Real' | 'Deepfake' }) {
    const isReal = status === 'Real';
    const color = isReal ? '#10b981' : '#ef4444';

    return (
        <div style={{
            position: 'relative',
            width: '250px',
            height: '320px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: `3px solid ${color}`,
            transition: 'transform 0.3s ease'
        }}>
            <img src={img} alt="Sample" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            {/* Bounding Box Simulation */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '15%',
                width: '70%',
                height: '50%',
                border: `2px solid ${color}`,
                boxShadow: `0 0 10px ${color}`
            }}></div>

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.8)',
                padding: '0.75rem',
                color: color,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {status}
            </div>
        </div>
    )
}

function Stat({ number, label }: { number: string, label: string }) {
    return (
        <div>
            <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 800, background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                {number}
            </div>
            <div style={{ color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {label}
            </div>
        </div>
    )
}
