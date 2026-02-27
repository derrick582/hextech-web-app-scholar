import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ActivityFeed = () => {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    const addLog = (message) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-19), { timestamp, message }]);
    };

    socket.on('project_created', (data) => {
      addLog(`[+] ${data.message}`);
    });

    socket.on('project_deleted', (data) => {
      addLog(`[-] ${data.message}`);
    });

    // Initial logs
    addLog('System link established.');
    addLog('Monitoring datastreams...');

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="border border-hacker-green/20 bg-black/80 p-4 font-mono text-[10px] h-64 flex flex-col">
      <div className="flex justify-between border-b border-hacker-green/10 pb-2 mb-2 text-hacker-green/40 uppercase tracking-widest">
        <span>&gt; Activity Feed</span>
        <span>Live Datastream</span>
      </div>
      <div className="flex-grow overflow-y-auto space-y-1 custom-scrollbar pr-2">
        {logs.map((log, i) => (
          <div key={i} className="flex space-x-2">
            <span className="text-hacker-green/30">[{log.timestamp}]</span>
            <span className={log.message.startsWith('[+]') ? 'text-cyan-400' : log.message.startsWith('[-]') ? 'text-red-400' : 'text-hacker-green'}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default ActivityFeed;
