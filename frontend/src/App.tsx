
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Detector from './components/Detector'

// Layout for main app pages (padding + navbar)
const MainLayout = () => (
  <>
    <Navbar />
    <div style={{ padding: '0 2rem' }}>
      <Outlet />
    </div>
  </>
)

function App() {
  return (
    <Router>
      <Routes>
        {/* Login is strictly separate, no navbar, no padding */}
        <Route path="/login" element={<Login />} />

        {/* All other routes use MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={
            <div className="container">
              <div className="header">
                <h1>Deepfake Detector</h1>
                <p className="subtitle">AI-Powered Authenticity Verification</p>
              </div>
              <Detector />
            </div>
          } />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
