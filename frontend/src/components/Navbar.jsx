import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, LogIn, UserPlus, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isAdmin = user?.roles?.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN');

  return (
    <nav className="glass fixed top-6 left-4 right-4 z-50 px-8 py-4 mx-auto max-w-7xl">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="text-xl font-black">E</span>
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
            EventSphere
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-white/70 hover:text-white transition-all flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Events
          </Link>
          
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-semibold text-white/70 hover:text-white transition-all flex items-center gap-2">
                  <Shield size={18} className="text-accent" />
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="text-sm font-semibold text-white/70 hover:text-white transition-all flex items-center gap-2">
                <User size={18} className="text-primary" />
                My Bookings
              </Link>
              <div className="h-4 w-px bg-white/10 mx-2"></div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white/50">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline border-white/10 hover:bg-white/5 py-2 px-4 text-xs uppercase tracking-widest font-bold"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/admin-login" className="text-sm font-bold text-accent/70 hover:text-accent transition-all flex items-center gap-2" title="Admin Login">
                <Shield size={18} />
                Admin
              </Link>
              <Link to="/login" className="text-sm font-bold text-white/70 hover:text-white transition-all flex items-center gap-2">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary shadow-xl shadow-primary/30 py-2.5 px-6 rounded-xl font-bold text-sm">
                <UserPlus size={18} />
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-4 animate-fade-in">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2 text-white/70 hover:text-white">
            <Calendar size={18} className="text-primary" /> Events
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2 text-white/70 hover:text-white">
                  <Shield size={18} className="text-accent" /> Admin Panel
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-2 text-white/70 hover:text-white">
                <User size={18} className="text-primary" /> My Bookings
              </Link>
              <div className="pt-4 flex flex-col gap-3">
                <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Logged in as {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline w-full justify-start border-white/10"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/admin-login" onClick={() => setIsMenuOpen(false)} className="btn btn-outline w-full justify-start border-white/10 text-accent hover:text-accent">
                <Shield size={18} /> Admin Login
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-outline w-full justify-start border-white/10">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary w-full">
                <UserPlus size={18} /> Join Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
