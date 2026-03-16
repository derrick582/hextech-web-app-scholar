import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ProjectListConsole = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  const fetchProjects = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/projects`);
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch projects');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(apiUrl);
    socket.on('project_created', () => fetchProjects());
    socket.on('project_deleted', () => fetchProjects());

    return () => socket.disconnect();
  }, []);

  const deleteProject = async (id) => {
    if (!window.confirm('[!] CONFIRM PURGE SEQUENCE?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Purge failed');
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-mono text-hacker-green animate-pulse uppercase tracking-[0.5em]">
        Scanning Datastreams...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-hacker-green/20 pb-2">
        <h2 className="font-mono text-hacker-green text-sm tracking-[0.2em] uppercase font-bold">
          &gt; Repository Index
        </h2>
        <span className="font-mono text-[10px] text-hacker-green/40">
          COUNT: {projects.length} RECORDS_FOUND
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.length === 0 ? (
          <div className="border border-dashed border-hacker-green/20 p-8 text-center">
            <span className="font-mono text-xs text-hacker-green/30 uppercase">No active projects in database</span>
          </div>
        ) : (
          projects.map(project => (
            <div key={project._id} className="border border-hacker-green/10 bg-hacker-green/5 p-4 hover:border-hacker-green/40 transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-mono text-hacker-green font-bold text-base tracking-tight uppercase">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[10px] text-hacker-green/60 mb-2 uppercase">
                    Author: {project.author} | ID: {project._id.substring(0, 8)}...
                  </p>
                </div>
                {user && (
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-red-500 hover:text-red-400 border border-red-900/50 px-2 py-0.5 uppercase"
                  >
                    [PURGE]
                  </button>
                )}
              </div>
              <p className="font-sans text-sm text-gray-400 leading-relaxed border-l-2 border-hacker-green/20 pl-4 py-1">
                {project.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectListConsole;
