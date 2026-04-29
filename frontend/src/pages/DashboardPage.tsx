import React from 'react';
import { LogOut, Link as LinkIcon } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../App';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <LinkIcon className="mr-3 text-blue-500" />
              URL Shortener
            </h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.name || 'User'}</p>
          </div>
          <div className="w-32">
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="glass rounded-3xl p-12 text-center border-dashed border-2 border-slate-700/50">
          <h2 className="text-xl text-slate-300 font-medium mb-4">Start Shortening</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            You're successfully logged in. This is your dashboard where you'll be able to manage your links.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
