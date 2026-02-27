import React, { useState, useRef, useEffect } from 'react';

const HackerCLI = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'info', text: 'NEURAL_LINK_V4.2.0 INITIALIZED' },
    { type: 'info', text: 'TYPE "HELP" FOR COMMAND LIST' }
  ]);
  const terminalEndRef = useRef(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const processCommand = async (cmd) => {
    const command = cmd.toLowerCase().trim();
    const newHistory = [...history, { type: 'command', text: `> ${cmd}` }];

    switch (command) {
      case 'help':
        newHistory.push({ type: 'info', text: 'AVAILABLE COMMANDS:' });
        newHistory.push({ type: 'info', text: ' - HELP: Display this menu' });
        newHistory.push({ type: 'info', text: ' - LIST: Query project repository' });
        newHistory.push({ type: 'info', text: ' - STATUS: System health check' });
        newHistory.push({ type: 'info', text: ' - CLEAR: Purge terminal buffer' });
        break;
      case 'list':
        newHistory.push({ type: 'info', text: 'QUERYING REPOSITORY...' });
        try {
          const res = await fetch('http://localhost:5000/api/projects');
          const data = await res.json();
          if (data.length === 0) {
            newHistory.push({ type: 'info', text: 'NO RECORDS FOUND.' });
          } else {
            data.forEach(p => {
              newHistory.push({ type: 'info', text: ` [${p._id.substring(0,6)}] ${p.title} BY ${p.author}` });
            });
          }
        } catch (err) {
          newHistory.push({ type: 'error', text: 'ERROR: REPOSITORY_UNREACHABLE' });
        }
        break;
      case 'status':
        newHistory.push({ type: 'info', text: 'SYSTEM STATUS: NOMINAL' });
        newHistory.push({ type: 'info', text: 'CORE: HEX-CORE-01' });
        newHistory.push({ type: 'info', text: 'UPLINK: ACTIVE' });
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        break;
      default:
        newHistory.push({ type: 'error', text: `COMMAND NOT FOUND: ${command}` });
    }

    setHistory(newHistory);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input);
      setInput('');
    }
  };

  return (
    <div className="bg-black border border-hacker-green/40 p-4 font-mono text-xs h-80 flex flex-col shadow-[0_0_15px_rgba(0,255,65,0.1)]">
      <div className="flex-grow overflow-y-auto mb-2 custom-scrollbar space-y-1">
        {history.map((line, i) => (
          <div key={i} className={line.type === 'error' ? 'text-red-500' : line.type === 'command' ? 'text-cyan-400' : 'text-hacker-green'}>
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex border-t border-hacker-green/20 pt-2">
        <span className="text-hacker-green mr-2">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none text-hacker-green flex-grow"
          autoFocus
        />
      </form>
    </div>
  );
};

export default HackerCLI;
