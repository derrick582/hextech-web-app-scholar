import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Login from './components/Login'
import ProjectEntryModule from './components/ProjectEntryModule'
import ProjectListConsole from './components/ProjectListConsole'
import ActivityFeed from './components/ActivityFeed'
import HackerCLI from './components/HackerCLI'
import { AuthProvider } from './context/AuthContext'

function AppContent() {
  const [status, setStatus] = useState('OFFLINE')
  const [dbStatus, setDbStatus] = useState('UNKNOWN')

  useEffect(() => {
    const checkHealth = () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/API/health`)
        .then(res => res.json())
        .then(data => {
          setStatus(data.status.toUpperCase())
          setDbStatus(data.database.toUpperCase())
        })
        .catch(() => {
          setStatus('CONNECTION_ERROR')
          setDbStatus('DISCONNECTED')
        })
    }

    checkHealth()
    const interval = setInterval(checkHealth, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-hacker-green selection:text-black">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <Hero />

        {/* System Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-hacker-green/20 p-4 bg-hacker-green/5 flex justify-between items-center text-hacker-green">
            <span className="font-mono text-[10px] tracking-widest opacity-60 uppercase">System Status</span>
            <span className={`font-mono text-xs font-bold ${status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>{status}</span>
          </div>
          <div className="border border-hacker-green/20 p-4 bg-hacker-green/5 flex justify-between items-center text-hacker-green">
            <span className="font-mono text-[10px] tracking-widest opacity-60 uppercase">Database Link</span>
            <span className={`font-mono text-xs font-bold ${dbStatus === 'CONNECTED' ? 'text-green-400' : 'text-red-400'}`}>{dbStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Auth & Activity */}
          <div className="space-y-8 lg:col-span-1">
            <Login />
            <ActivityFeed />
          </div>

          {/* Right Column: Projects & CLI */}
          <div className="space-y-8 lg:col-span-2">
            <ProjectEntryModule />
            <ProjectListConsole />
            <div className="space-y-2">
              <h3 className="font-mono text-hacker-green text-[10px] uppercase tracking-[0.3em] font-bold ml-1">Remote Terminal Access</h3>
              <HackerCLI />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
