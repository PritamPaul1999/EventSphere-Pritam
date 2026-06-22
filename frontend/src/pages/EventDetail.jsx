import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowLeft, Ticket, ShieldCheck, Clock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BookingModal from '../components/BookingModal';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/events/${id}`);
        setEvent({
          ...response.data,
          image: getImageForCategory(response.data.category),
          price: response.data.price || getPriceForCategory(response.data.category)
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const getPriceForCategory = (category) => {
    if (!category) return 99;
    const cat = category.toLowerCase();
    if (cat.includes('tech')) return 299;
    if (cat.includes('music')) return 89;
    if (cat.includes('design')) return 149;
    return 99;
  };

  const getImageForCategory = (category) => {
    if (!category) return '/assets/tech.png';
    const cat = category.toLowerCase();
    if (cat.includes('tech')) return '/assets/tech.png';
    if (cat.includes('music')) return '/assets/music.png';
    if (cat.includes('design')) return '/assets/design.png';
    return '/assets/tech.png';
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl mb-4">Event Not Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-outline">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left Column: Image and Description */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden aspect-video glass p-2"
          >
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute top-6 left-6 glass px-4 py-1.5 text-[10px] font-black text-white uppercase tracking-widest border-primary/30">
              {event.category || 'General'}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-black leading-tight">{event.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-text-muted">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-glass-border">
                <Calendar size={18} className="text-primary" />
                <span className="text-sm font-semibold">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-glass-border">
                <MapPin size={18} className="text-secondary" />
                <span className="text-sm font-semibold">{event.location}</span>
              </div>
            </div>

            <div className="h-px bg-glass-border w-full"></div>

            <div className="space-y-4 text-lg text-text-muted leading-relaxed">
              <h3 className="text-white text-xl">About the Event</h3>
              <p>
                {event.description || "Experience an unforgettable event at " + event.location + ". This is a unique opportunity to connect with like-minded individuals and explore the latest in " + (event.category || "the industry") + "."}
              </p>
              <p>
                Don't miss out on this chance to be part of something extraordinary. Secure your tickets now to guarantee your spot!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-8 sticky top-24 space-y-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Price per Seat</p>
                <h2 className="text-3xl font-black text-primary">${event.price || 0}</h2>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Availability</p>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${event.availableTickets > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {event.availableTickets} Tickets Left
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-glass-border">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-bold">Starts at</p>
                  <p className="font-bold">09:00 AM local time</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-glass-border">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-bold">Refund Policy</p>
                  <p className="font-bold">No refunds 24h before</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBookNow}
              disabled={event.availableTickets === 0}
              className="btn btn-primary w-full py-5 text-lg font-bold flex items-center justify-center gap-2 group"
            >
              <Ticket size={24} className="group-hover:rotate-12 transition-transform" />
              {event.availableTickets > 0 ? 'Book Tickets Now' : 'Sold Out'}
            </button>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Event link copied to clipboard!");
                }}
                className="btn btn-outline flex-1 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                <Share2 size={16} />
                Copy Link
              </button>
              <button 
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=Check out this amazing event: ${event.title}`, '_blank');
                }}
                className="btn btn-outline flex-1 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                <Users size={16} />
                Share
              </button>
            </div>

            <p className="text-[10px] text-center text-text-muted uppercase tracking-widest">
              Join {event.totalTickets - event.availableTickets} others already attending
            </p>
          </motion.div>
        </div>
      </div>

      {isModalOpen && (
        <BookingModal 
          event={event}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBookingSuccess={() => {
            showToast("Tickets booked successfully! Enjoy your event.");
            // Refresh local state
            setEvent(prev => ({ ...prev, availableTickets: Math.max(0, prev.availableTickets - 1) }));
          }}
        />
      )}
    </div>
  );
};

export default EventDetail;
