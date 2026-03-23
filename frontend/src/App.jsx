import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Calculator from './components/Calculator'

function App() {
  const [status, setStatus] = useState('OFFLINE')

  useEffect(() => {
    fetch('http://localhost:5000/API/health')
      .then(res => res.json())
      .then(data => setStatus(data.status.toUpperCase()))
      .catch(() => setStatus('CONNECTION_ERROR'))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex flex-col">
        <Hero />
        <Calculator />
        <div className="max-w-4xl mx-auto w-full p-10 mt-auto">
          <div className="border border-hacker-green/20 p-4 bg-hacker-green/5 flex justify-between items-center text-hacker-green">
            <span className="font-mono text-xs tracking-widest opacity-60 uppercase">System Status</span>
            <span className={`font-mono text-xs font-bold ${status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>{status}</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
