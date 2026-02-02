import React, { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'

export default function Detector() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isCameraOpen, setIsCameraOpen] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
            setResult(null)
            setError(null)
            setIsCameraOpen(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0]
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
            setResult(null)
            setError(null)
            setIsCameraOpen(false)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const startCamera = async () => {
        setIsCameraOpen(true)
        setFile(null)
        setPreview(null)
        setResult(null)
        setError(null)

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (err) {
            console.error("Error accessing camera:", err)
            setError("Could not access camera. Please check permissions.")
            setIsCameraOpen(false)
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
        }
        setIsCameraOpen(false)
    }

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')

            if (context) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                context.translate(canvas.width, 0)
                context.scale(-1, 1)
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                    if (blob) {
                        const capturedFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
                        setFile(capturedFile)
                        setPreview(URL.createObjectURL(capturedFile))
                        stopCamera()
                    }
                }, 'image/jpeg', 0.95)
            }
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        try {


            // Determine backend URL
            // If running on Vite default port (5173), assume local backend on port 8000.
            // Otherwise (Production/Vercel), use relative path to same domain.
            const isDev = window.location.port === '5173';
            const apiBase = isDev ? `http://${window.location.hostname}:8000` : '';
            const endpoint = `${apiBase}/api/detect`;

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            })


            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }

            const data = await response.json()
            setResult(data)
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const renderResult = () => {
        if (!result) return null

        let predObj = result.prediction
        if (typeof predObj === 'string') {
            try { predObj = JSON.parse(predObj) } catch (e) { }
        }

        let isFake = false
        let confidenceReal = 0
        let confidenceFake = 0
        let label = "Unknown"

        if (predObj && typeof predObj === 'object') {
            if ('Prediction' in predObj) {
                label = predObj['Prediction']
                confidenceReal = predObj['Real Confidence'] || 0
                confidenceFake = predObj['Fake Confidence'] || 0
                if (label.toLowerCase().includes('fake')) isFake = true
            } else {
                const keys = Object.keys(predObj)
                const fakeKey = keys.find(k => k.toLowerCase().includes('fake'))
                const realKey = keys.find(k => k.toLowerCase().includes('real'))
                if (fakeKey) confidenceFake = predObj[fakeKey]
                if (realKey) confidenceReal = predObj[realKey]
                if (confidenceFake > confidenceReal) { isFake = true; label = "Fake" } else { label = "Real" }
            }
        } else {
            label = String(predObj)
            if (label.toLowerCase().includes('fake')) isFake = true
        }

        const pctReal = Math.round(confidenceReal * 100)
        const pctFake = Math.round(confidenceFake * 100)
        const displayLabel = isFake ? "⚠️ POTENTIAL DEEPFAKE" : "✅ LIKELY REAL"
        const displayClass = isFake ? "fake" : "real"

        return (
            <div className="result-box">
                <div className={`result-label ${displayClass}`}>{displayLabel}</div>

                <div className="confidence-container">
                    <div className="confidence-item">
                        <div className="confidence-header">
                            <span>Real / Authentic</span>
                            <span>{pctReal}%</span>
                        </div>
                        <div className="bar-bg">
                            <div className="bar-fill real" style={{ width: `${pctReal}%` }}></div>
                        </div>
                    </div>

                    <div className="confidence-item">
                        <div className="confidence-header">
                            <span>Deepfake / Generated</span>
                            <span>{pctFake}%</span>
                        </div>
                        <div className="bar-bg">
                            <div className="bar-fill fake" style={{ width: `${pctFake}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            {isCameraOpen ? (
                <div className="camera-container">
                    <video ref={videoRef} autoPlay playsInline className="camera-video" />
                    <div className="camera-controls">
                        <button className="btn-secondary" onClick={stopCamera}>Cancel</button>
                        <button className="btn-capture" onClick={captureImage} aria-label="Capture">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : preview ? (
                <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                </div>
            ) : (
                <>
                    <div
                        className="upload-area"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <svg className="icon-upload" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <p>Drag & Drop your image here, or click to browse</p>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>

                    <div className="or-divider">OR</div>

                    <button className="btn-secondary" style={{ width: '100%' }} onClick={startCamera}>
                        Use Camera
                    </button>
                </>
            )}

            {error && <div className="error-msg">{error}</div>}

            {!isCameraOpen && (
                <button
                    className="btn"
                    onClick={handleUpload}
                    disabled={!file || loading}
                >
                    {loading ? "Analyzing..." : "Analyze Image"}
                </button>
            )}

            {renderResult()}

            {(preview && !loading) && (
                <button
                    style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', width: '100%' }}
                    onClick={() => {
                        setFile(null);
                        setPreview(null);
                        setResult(null);
                        setError(null);
                    }}
                >
                    {result ? "Analyze New Image" : "Clear / Upload New"}
                </button>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    )
}
