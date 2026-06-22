import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, Edit, Trash2, Search, Filter, AlertCircle, CheckCircle2, X, Calendar, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    totalTickets: 100,
    availableTickets: 100,
    category: 'Technology'
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({ ...event });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        totalTickets: 100,
        availableTickets: 100,
        category: 'Technology'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingEvent) {
        await axios.put(`http://localhost:8080/api/events/${editingEvent.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast("Event updated successfully!");
      } else {
        await axios.post('http://localhost:8080/api/events', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast("Event created successfully!");
      }
      fetchEvents();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving event:", error);
      showToast("Error saving event. Please check your permissions.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        showToast("Error deleting event.", "error");
      }
    }
  };

  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'users'
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast("User access revoked successfully!");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        showToast("Error revoking user access.", "error");
      }
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col items-center text-center gap-6 border-b border-glass-border pb-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Admin <span className="text-primary">Management</span></h1>
          </div>
          <p className="text-text-muted text-sm md:text-lg font-medium">Global platform control and orchestration center</p>
        </div>
        <div className="flex items-center justify-center gap-4 w-full lg:w-auto">
          {activeTab === 'events' && (
            <button 
              onClick={() => handleOpenModal()}
              className="btn btn-primary px-8 py-4 flex items-center gap-2 shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all flex-1 lg:flex-none"
            >
              <Plus size={20} />
              Create New Event
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-glass-border w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'events' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            <Calendar size={18} />
            Events
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            <Users size={18} />
            Users
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Filter events..." 
                className="input-field pl-12 py-3 bg-white/5 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-black whitespace-nowrap ml-auto md:ml-0">
              {filteredEvents.length} TOTAL
            </div>
          </div>
        )}
      </div>

      {activeTab === 'events' ? (
        <>

          <div className="glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-glass-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Event Details</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Category</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Status</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Tickets</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-20 text-center text-text-muted italic">Loading events data...</td></tr>
                  ) : filteredEvents.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-20 text-center text-text-muted italic">No events found matching your criteria.</td></tr>
                  ) : (
                    filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                        <td className="px-6 py-8">
                          <div className="flex flex-col">
                            <span className="font-black text-xl mb-1 group-hover:text-primary transition-colors">{event.title}</span>
                            <div className="flex items-center gap-2 text-sm text-text-muted font-medium">
                              <Calendar size={14} className="text-primary/50" />
                              {new Date(event.date).toLocaleDateString()}
                              <span className="w-1 h-1 rounded-full bg-white/20"></span>
                              <MapPin size={14} className="text-secondary/50" />
                              {event.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-8">
                          <span className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                            {event.category || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-8">
                          <div className="flex items-center gap-2">
                            {event.availableTickets > 0 ? (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success border border-success/20">
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-error/10 text-error border border-error/20">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Sold Out</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-8">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                              <span>{event.availableTickets}</span>
                              <span className="text-text-muted">/ {event.totalTickets}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(event.availableTickets / event.totalTickets) * 100}%` }}
                                className={`h-full ${event.availableTickets < 10 ? 'bg-error' : 'bg-primary'}`}
                              ></motion.div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpenModal(event)}
                              className="p-2.5 rounded-xl bg-white/5 hover:bg-primary text-white/50 hover:text-white transition-all shadow-lg"
                              title="Edit Event"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(event.id)}
                              className="p-2.5 rounded-xl bg-white/5 hover:bg-error text-white/50 hover:text-white transition-all shadow-lg"
                              title="Delete Event"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-glass-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">User Info</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Email</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted">Roles</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {usersLoading ? (
                  <tr><td colSpan="4" className="px-6 py-20 text-center text-text-muted italic">Loading users data...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-20 text-center text-text-muted italic">No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.userId || u.id} className="hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                      <td className="px-6 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-black text-xl border border-primary/20 shadow-inner">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-lg group-hover:text-primary transition-colors">{u.name || 'Unknown User'}</span>
                            <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">ID: {String(u.userId || u.id || 'N/A').slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{u.email}</span>
                          <span className="text-[10px] text-text-muted font-medium italic">Verified Account</span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-wrap gap-2">
                          {u.roles?.map((role, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest border border-accent/20">
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-8 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u.userId || u.id)}
                          className="p-3 rounded-xl bg-white/5 hover:bg-error text-white/50 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                          title="Revoke Access"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 bg-[#0b0f1a]/98 backdrop-blur-xl overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass max-w-2xl w-full p-8 relative mb-20"
            >
              <button 
                onClick={handleCloseModal} 
                className="absolute top-8 right-8 text-text-muted hover:text-white z-50 p-2 hover:bg-white/10 rounded-full transition-all"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black mb-8">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="input-group col-span-2">
                    <label>Event Title</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      required 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="input-group col-span-2">
                    <label>Description</label>
                    <textarea 
                      className="input-field h-24 resize-none" 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="input-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      required 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>

                  <div className="input-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      required 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div className="input-group">
                    <label>Category</label>
                    <select 
                      className="input-field bg-dark"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Music">Music</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Total Tickets</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      required 
                      value={formData.totalTickets}
                      onChange={(e) => setFormData({...formData, totalTickets: parseInt(e.target.value), availableTickets: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-glass-border">
                  <button type="button" onClick={handleCloseModal} className="btn btn-outline flex-1">Cancel</button>
                  <button type="submit" className="btn btn-primary flex-[2]">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
