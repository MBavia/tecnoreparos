
import React, { useState } from 'react';
import { User } from '../types';
import ThemeToggle from './ThemeToggle';

interface LoginPageProps {
  onLogin: (user: User) => void;
  theme: string;
  onToggleTheme: () => void;
}

const WrenchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin, theme, onToggleTheme }) => {
  const [username, setUsername] = useState('tecnico');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'tecnico' && password === '1234') {
      onLogin({ username });
      setError('');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/50 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle theme={theme} toggleTheme={onToggleTheme} />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="p-3 mb-4 bg-primary rounded-full text-primary-foreground">
            <WrenchIcon className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">TecnoReparos</h1>
          <p className="text-muted-foreground mt-2">Sistema de Gerenciamento de O.S.</p>
        </div>
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-card-foreground">Login</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="username">Usuário</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="ex: tecnico"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background transition-colors duration-300"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
