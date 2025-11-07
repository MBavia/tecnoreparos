import React from 'react';
import { User } from '../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  theme: string;
  onToggleTheme: () => void;
}

const WrenchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);

const LogOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, onToggleTheme }) => {
  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
             <WrenchIcon className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">TecnoReparos</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Olá, <span className="font-semibold">{user.username}</span>
            </span>
            <ThemeToggle theme={theme} toggleTheme={onToggleTheme} />
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Sair do sistema"
            >
              <LogOutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;