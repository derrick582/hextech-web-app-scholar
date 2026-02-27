import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProjectEntryModule = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: ''
  });
  const [status, setStatus] = useState('');

  const { title, description, author } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setStatus('TRANSMITTING...');

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ title: '', description: '', author: '' });
        setStatus('UPLOAD COMPLETE');
        setTimeout(() => setStatus(''), 3000);
      } else {
        const data = await res.json();
        setStatus(`ERROR: ${data.msg || 'FAILED'}`);
      }
    } catch (err) {
      setStatus('CONNECTION LOST');
    }
  };

  if (!user) {
    return (
      <div className="border border-red-900/30 p-8 bg-red-900/5 text-center">
        <span className="font-mono text-xs text-red-500 uppercase tracking-[0.4em] font-bold">
          [ ACCESS DENIED: AUTHENTICATION TOKEN MISSING ]
        </span>
      </div>
    );
  }

  return (
    <div className="border border-cyan-500/30 p-6 bg-black space-y-4">
      <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
        <h2 className="font-mono text-cyan-400 text-sm tracking-[0.2em] uppercase font-bold">
          &gt; Project Deployment Console
        </h2>
        {status && (
          <span className="font-mono text-[10px] text-cyan-500 animate-pulse bg-cyan-900/10 px-2 py-0.5 border border-cyan-900/30">
            {status}
          </span>
        )}
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-cyan-500/60 uppercase tracking-widest mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              className="w-full bg-cyan-500/5 border border-cyan-500/20 p-2 font-mono text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="PROJECT_ID_ALPHA"
              required
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-cyan-500/60 uppercase tracking-widest mb-1">Author Alias</label>
            <input
              type="text"
              name="author"
              value={author}
              onChange={onChange}
              className="w-full bg-cyan-500/5 border border-cyan-500/20 p-2 font-mono text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="ANONYMOUS_ENTITY"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-cyan-500/60 uppercase tracking-widest mb-1">System Specs / Description</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            rows="5"
            className="w-full bg-cyan-500/5 border border-cyan-500/20 p-2 font-mono text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
            placeholder="DEFINE_OPERATIONAL_PARAMETERS..."
            required
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2 bg-cyan-500/10 border border-cyan-500/40 font-mono text-cyan-400 text-xs uppercase tracking-[0.5em] hover:bg-cyan-500 hover:text-black transition-all font-bold"
          >
            [ EXECUTE_DEPLOYMENT ]
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEntryModule;
