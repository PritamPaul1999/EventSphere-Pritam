import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/events');
      // Merge with sample images
      const data = response.data.map(event => ({
        ...event,
        image: getImageForCategory(event.category),
        price: event.price || getPriceForCategory(event.category)
      }));
      setEvents(data);
    } catch (error) {
      console.error("Backend offline, using sample data");
      setEvents([
        { id: 1, title: 'Global Tech Summit 2026', date: '2026-10-15', location: 'San Francisco, CA', totalTickets: 500, availableTickets: 500, category: 'Technology', image: '/assets/tech.png', price: 299 },
        { id: 2, title: 'Nebula Music Festival', date: '2026-11-20', location: 'London, UK', totalTickets: 2000, availableTickets: 2000, category: 'Music', image: '/assets/music.png', price: 89 },
        { id: 3, title: 'Design Masters Workshop', date: '2026-12-05', location: 'Berlin, Germany', totalTickets: 50, availableTickets: 50, category: 'Design', image: '/assets/design.png', price: 149 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleSecureTicket = (event) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-24 mt-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
          <Sparkles size={14} />
          The Future of Event Management
        </div>
        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-center">
          Discover Extraordinary <br/>
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Experiences
          </span>
        </h1>
        <p className="text-white/50 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed text-center mb-10">
          Join thousands of people discovering and booking the best events happening around the world.
        </p>

        <div className="relative w-full max-w-xl mx-auto">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="Search events, locations, or categories..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="glass glass-hover p-2 group"
            >
              <div 
                className="relative overflow-hidden rounded-2xl h-56 mb-6 cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                  <div className="absolute top-4 left-4 z-10 glass px-4 py-1.5 text-[10px] font-black text-white uppercase tracking-widest border-primary/30">
                    {event.category || 'General'}
                  </div>
                 <img 
                   src={event.image} 
                   alt={event.title} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60"></div>
              </div>

              <div className="px-4 pb-4">
                <h3 
                  className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-1 cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {event.title}
                </h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm font-medium text-white/40">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Calendar size={14} className="text-primary" />
                    </div>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-white/40">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <MapPin size={14} className="text-secondary" />
                    </div>
                    {event.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-white/40">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Users size={14} className="text-accent" />
                    </div>
                    {event.availableTickets ?? event.totalTickets} Tickets Left
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="flex-1 py-4 rounded-xl bg-white/5 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => handleSecureTicket(event)}
                    className="flex-[2] py-4 rounded-xl bg-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-hover text-white transition-all duration-300"
                  >
                    Book Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">No events found</h3>
            <p className="text-white/40">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
        </div>
      )}

      {selectedEvent && (
        <BookingModal 
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBookingSuccess={() => {
             showToast("Tickets booked successfully! View them in your dashboard.");
             fetchEvents();
          }}
        />
      )}
    </div>
  );
};

export default Home;
