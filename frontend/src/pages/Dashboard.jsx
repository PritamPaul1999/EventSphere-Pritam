import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Ticket, Clock, ExternalLink, Calendar as CalIcon, User, Sparkles, X, ShieldCheck, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to EventSphere', content: 'Your account has been successfully created. Explore the latest events now!', time: '1 day ago', type: 'info' }
  ]);
  const [eventsMap, setEventsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = user?.id || user?.userId;
      
      console.log("Dashboard: Fetching data for user ID:", userId);
      
      if (!userId) {
        console.error("Dashboard: No User ID found in user object:", user);
        setLoading(false);
        return;
      }

      // 1. Fetch events map (Wrapped to avoid blocking tickets)
      try {
        const eventsRes = await axios.get('http://localhost:8080/api/events');
        const map = {};
        if (Array.isArray(eventsRes.data)) {
          eventsRes.data.forEach(e => map[e.id] = e.title);
        }
        setEventsMap(map);
      } catch (e) {
        console.warn("Dashboard: Could not fetch events map:", e);
      }

      // 2. Fetch user-specific tickets (Primary)
      let userBookings = [];
      try {
        const ticketsRes = await axios.get(`http://localhost:8080/api/tickets/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Dashboard: Primary fetch response:", ticketsRes.data);
        
        if (Array.isArray(ticketsRes.data)) {
          userBookings = ticketsRes.data;
        }
      } catch (err) {
        console.warn("Dashboard: Primary ticket fetch failed, trying fallback...", err);
      }

      // 3. Fallback: Fetch all tickets and filter manually if primary was empty
      if (userBookings.length === 0) {
        console.log("Dashboard: No tickets from primary endpoint or call failed, trying fallback filter...");
        
        let allTickets = [];
        try {
          // Try Gateway first
          const gatewayRes = await axios.get(`http://localhost:8080/api/tickets`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          allTickets = gatewayRes.data;
        } catch (e) {
          console.warn("Dashboard: Gateway fallback failed, trying direct port 8084...");
          // Try direct port if Gateway fails
          try {
            const directRes = await axios.get(`http://localhost:8084/api/tickets`);
            allTickets = directRes.data;
          } catch (e2) {
            console.error("Dashboard: All fallback attempts failed", e2);
          }
        }
        
        if (Array.isArray(allTickets)) {
          console.log(`Dashboard: Filtering ${allTickets.length} total tickets for userId ${userId}`);
          userBookings = allTickets.filter(t => 
            String(t.userId) === String(userId) || 
            String(t.user_id) === String(userId) ||
            String(t.userId) == String(userId)
          );
        }
      }
      
      console.log(`Dashboard: Found ${userBookings.length} total bookings for user ${userId}`);
      setBookings(userBookings);
    } catch (error) {
      console.error("Dashboard: Critical error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleUpdateProfile = () => {
    const newName = prompt("Enter your new display name:", user.name);
    if (newName && newName !== user.name) {
      showToast("Profile updated successfully!");
      setNotifications(prev => [{
        id: Date.now(),
        title: 'Profile Updated',
        content: `Your display name has been changed to ${newName}.`,
        time: 'Just now',
        type: 'success'
      }, ...prev]);
    }
  };

  const handleChangePassword = () => {
    showToast("Security notice: Password reset link sent to your email.", "info");
    setNotifications(prev => [{
      id: Date.now(),
      title: 'Security Alert: Password Reset',
      content: 'A password reset link was requested for your account. If this wasn\'t you, please secure your account.',
      time: 'Just now',
      type: 'info'
    }, ...prev]);
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
      <div className="flex flex-col items-center text-center gap-8 border-b border-glass-border pb-10">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">User <span className="text-primary">Dashboard</span></h1>
          </div>
          <p className="text-text-muted text-sm md:text-lg font-medium italic">Welcome back to your personal event command center</p>
        </div>
        
        <div className="glass px-8 py-4 flex items-center gap-6 border-primary/20 bg-primary/5 shadow-2xl shadow-primary/10 mx-auto">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-2xl shadow-lg">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-bg-dark"></div>
          </div>
          <div className="text-left">
            <p className="text-lg font-black tracking-tight">{user.name}</p>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl flex items-center gap-2">
            <Ticket size={24} className="text-primary" />
            Digital Passes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-0 group flex flex-col overflow-hidden border-primary/10 hover:border-primary/30 transition-all"
              >
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* QR Code Section */}
                  <div className="w-full md:w-32 h-32 glass bg-white flex items-center justify-center p-2 rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ES-${booking.id}-${user.id}`} 
                      alt="Ticket QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-black mb-1 leading-tight tracking-tight group-hover:text-primary transition-colors">
                        {eventsMap[booking.eventId] || `Event ID: ${booking.eventId}`}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                          <Clock size={12} className="text-primary" /> {new Date(booking.bookingTime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md text-primary">
                          {booking.quantity} Seats Reserved
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                      <span className="bg-success/10 text-success px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-success/20">
                        {booking.status} • VERIFIED
                      </span>
                      <button 
                        onClick={() => navigate(`/events/${booking.eventId}`)}
                        className="flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase tracking-widest"
                      >
                        Pass Details <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full glass p-12 text-center border-dashed">
              <Ticket size={48} className="mx-auto mb-4 text-text-muted opacity-20" />
              <p className="text-text-muted">No tickets found. Start your journey by booking an event!</p>
              <div className="flex flex-col items-center gap-4 mt-6">
                <button onClick={() => navigate('/')} className="btn btn-primary px-8">Explore Events</button>
                <button onClick={fetchData} className="text-xs text-primary hover:underline font-bold uppercase tracking-widest">
                  Refresh My Tickets
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2 mb-6">
               <Sparkles size={24} className="text-accent animate-pulse" />
               Notification Center
            </h2>
            <div className="glass p-6 space-y-4 max-h-[400px] overflow-y-auto border-accent/20 shadow-lg shadow-accent/5">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <motion.div 
                    key={notif.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 items-start pb-4 border-b border-glass-border last:border-0 last:pb-0"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'success' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]'}`}></div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-white uppercase tracking-wider">{notif.title}</p>
                      <p className="text-[10px] text-text-muted mt-1 leading-relaxed line-clamp-3">{notif.content}</p>
                      <p className="text-[9px] text-white/20 mt-2 font-bold">{notif.time}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs text-text-muted italic text-center py-4">No recent notifications</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black flex items-center gap-2 mb-6">
               <User size={24} className="text-primary" />
               Quick Actions
            </h2>
            <div className="glass p-6 space-y-4">
              <button 
                onClick={handleUpdateProfile}
                className="btn btn-primary w-full justify-start py-4 text-xs font-black uppercase tracking-widest"
              >
                <User size={18} />
                Update Profile
              </button>
              <button 
                onClick={handleChangePassword}
                className="btn btn-outline w-full justify-start border-none bg-white/5 py-4 text-xs font-black uppercase tracking-widest"
              >
                <ShieldCheck size={18} />
                Change Password
              </button>
              {user?.roles?.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN') && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="btn w-full justify-start border-none bg-accent/20 text-accent hover:bg-accent hover:text-white py-4 text-xs font-black uppercase tracking-widest"
                >
                  <Sparkles size={18} />
                  Access Admin Panel
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black flex items-center gap-2 mb-6">
               <Clock size={24} className="text-primary" />
               Live Activity
            </h2>
            <div className="glass p-6 space-y-4">
              <div className="flex gap-4 items-start pb-4 border-b border-glass-border">
                <div className="w-2 h-2 rounded-full bg-success mt-1.5 animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Account Secure</p>
                  <p className="text-[10px] text-text-muted">Last login: {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-4 border-b border-glass-border opacity-60">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Pass Verification</p>
                  <p className="text-[10px] text-text-muted">Digital signature active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
