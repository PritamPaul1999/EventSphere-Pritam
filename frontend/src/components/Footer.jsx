import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-glass-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="text-xl font-black">E</span>
              </div>
              <span className="text-2xl font-black tracking-tight">EventSphere</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              Your premier platform for discovering, booking, and managing extraordinary events worldwide. Built with modern microservices architecture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/40 hover:text-primary text-sm transition-colors">Browse Events</Link></li>
              <li><Link to="/dashboard" className="text-white/40 hover:text-primary text-sm transition-colors">My Bookings</Link></li>
              <li><Link to="/login" className="text-white/40 hover:text-primary text-sm transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-white/40 hover:text-primary text-sm transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Tech Stack</h4>
            <ul className="space-y-3">
              <li className="text-white/40 text-sm">Spring Boot Microservices</li>
              <li className="text-white/40 text-sm">React + Vite</li>
              <li className="text-white/40 text-sm">MySQL Database</li>
              <li className="text-white/40 text-sm">Eureka Service Discovery</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-glass-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} EventSphere. All rights reserved.
          </p>
          <p className="text-white/30 text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> using Spring Boot & React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
