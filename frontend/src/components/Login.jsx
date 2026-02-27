import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login, register, user, logout } = useAuth();

  const { username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    const result = isRegister
      ? await register(username, password)
      : await login(username, password);

    if (!result.success) {
      setError(result.msg);
    }
  };

  if (user) {
    return (
      <div className="border border-hacker-green/30 p-4 bg-black flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-hacker-green animate-pulse rounded-full"></div>
          <span className="font-mono text-sm text-hacker-green tracking-tighter uppercase">
            Logged in as: <span className="font-bold">{user.username}</span>
          </span>
        </div>
        <button
          onClick={logout}
          className="font-mono text-xs text-red-500 hover:text-red-400 border border-red-900 px-2 py-1 hover:bg-red-900/10 transition-colors uppercase tracking-widest"
        >
          [Terminate Session]
        </button>
      </div>
    );
  }

  return (
    <div className="border border-hacker-green/30 p-6 bg-black space-y-4">
      <h2 className="font-mono text-hacker-green text-sm tracking-[0.2em] uppercase font-bold border-b border-hacker-green/10 pb-2">
        {isRegister ? '> Initialize New Identity' : '> Authentication Required'}
      </h2>

      {error && (
        <div className="font-mono text-[10px] text-red-500 bg-red-900/10 p-2 border border-red-900/30 uppercase">
          [!] Error: {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-[10px] text-hacker-green/60 uppercase tracking-widest mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            className="w-full bg-hacker-green/5 border border-hacker-green/20 p-2 font-mono text-sm text-hacker-green focus:outline-none focus:border-hacker-green/50 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-hacker-green/60 uppercase tracking-widest mb-1">Pass-key</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            className="w-full bg-hacker-green/5 border border-hacker-green/20 p-2 font-mono text-sm text-hacker-green focus:outline-none focus:border-hacker-green/50 transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-hacker-green/10 border border-hacker-green/40 font-mono text-hacker-green text-xs uppercase tracking-[0.3em] hover:bg-hacker-green hover:text-black transition-all font-bold"
        >
          {isRegister ? 'Execute Registration' : 'Access System'}
        </button>
      </form>

      <div className="pt-2">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="font-mono text-[10px] text-hacker-green/40 hover:text-hacker-green uppercase tracking-widest transition-colors"
        >
          {isRegister ? ':: Already have credentials? Sign-in' : ':: No credentials? Initialize ID'}
        </button>
      </div>
    </div>
  );
};

export default Login;
