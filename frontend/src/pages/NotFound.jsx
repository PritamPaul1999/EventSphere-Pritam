import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-[10rem] font-black leading-none bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4 -mt-4">Page Not Found</h2>
        <p className="text-white/40 text-lg mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn btn-primary px-8 py-4">
            <Home size={20} />
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline px-8 py-4">
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
