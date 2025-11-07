
import React, { useState, useEffect, useCallback } from 'react';
import { User } from './types';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {currentUser ? (
        <DashboardPage user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
      ) : (
        <LoginPage onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />
      )}
    </div>
  );
};

export default App;
