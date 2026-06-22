import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-10 w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 text-accent/5 pointer-events-none">
          <ShieldAlert size={160} />
        </div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 mx-auto bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Admin Portal</h2>
          <p className="text-text-muted">Secure access for platform administrators</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="input-group">
            <label className="text-accent">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-text-muted" size={18} />
              <input 
                type="email" 
                className="input-field pl-12 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                placeholder="admin@eventsphere.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="text-accent">Security Key (Password)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-text-muted" size={18} />
              <input 
                type="password" 
                className="input-field pl-12 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn w-full py-4 mt-4 bg-accent hover:bg-accent/80 text-white shadow-lg shadow-accent/20"
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : (
              <span className="flex items-center justify-center gap-2">
                Verify Identity
                <ArrowRight size={20} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-glass-border text-center relative z-10">
          <Link to="/login" className="text-sm font-bold text-white/50 hover:text-white transition-colors">
            Return to User Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
