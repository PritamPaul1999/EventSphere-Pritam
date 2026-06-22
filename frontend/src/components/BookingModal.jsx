import React, { useState } from 'react';
import { X, Ticket, ShieldCheck, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ event, isOpen, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Selection, 2: Payment, 3: Success
  const [quantity, setQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });

  const handleNext = () => {
    if (!user) {
      setError("Please login to book tickets");
      return;
    }
    setStep(2);
  };

  const handleBook = async () => {
    setIsBooking(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const userId = user.id || user.userId;
      
      await axios.post('http://localhost:8080/api/tickets/book', {
        eventId: event.id,
        userId: userId,
        quantity: quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onBookingSuccess();
      onClose();
    } catch (err) {
      console.error("Booking Error:", err);
      setError("Payment verification failed. Please check your card details.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/90 backdrop-blur-md cursor-pointer"
          onClick={onClose}
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass max-w-md w-full p-8 relative overflow-hidden shadow-2xl border-primary/20"
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-all cursor-pointer z-50 p-2 hover:bg-white/10 rounded-full"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-primary' : 'bg-white/10'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`}></div>
            </div>

            {step === 1 ? (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
                    <Ticket size={32} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Select Quantity</h2>
                  <p className="text-text-muted text-sm mt-1">{event.title}</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-6 py-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 glass flex items-center justify-center text-2xl font-black hover:bg-primary hover:text-white transition-all rounded-2xl"
                    >
                      -
                    </button>
                    <div className="text-4xl font-black w-20 text-center">
                      {quantity}
                    </div>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-14 h-14 glass flex items-center justify-center text-2xl font-black hover:bg-primary hover:text-white transition-all rounded-2xl"
                    >
                      +
                    </button>
                  </div>

                  <div className="glass p-6 bg-white/5 border-dashed border-white/20">
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-text-muted font-bold uppercase tracking-widest">Price per seat</span>
                      <span className="font-black">${event.price || 0}</span>
                    </div>
                    <div className="flex justify-between font-black text-xl border-t border-glass-border pt-4">
                      <span>Total Due</span>
                      <span className="text-primary">${(event.price || 0) * quantity}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleNext}
                    className="btn btn-primary w-full py-5 text-base font-black flex items-center justify-center gap-2"
                  >
                    Proceed to Payment
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mx-auto mb-4 border border-accent/20">
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Secure Payment</h2>
                  <p className="text-text-muted text-sm mt-1 tracking-widest uppercase font-bold">Checkout Summary: {quantity} Tickets</p>
                </div>

                {error && (
                  <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl mb-6 text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="input-group mb-0">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="XXXX XXXX XXXX XXXX" 
                      className="input-field bg-white/5 py-4"
                      value={cardData.number}
                      onChange={(e) => setCardData({...cardData, number: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group mb-0">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="input-field bg-white/5 py-4"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                      />
                    </div>
                    <div className="input-group mb-0">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">CVV</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        className="input-field bg-white/5 py-4"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <button 
                      onClick={handleBook}
                      disabled={isBooking}
                      className="btn btn-primary w-full py-5 text-base font-black flex items-center justify-center gap-2 shadow-2xl shadow-primary/40"
                    >
                      {isBooking ? <Loader2 className="animate-spin" /> : (
                        <>
                          Complete Secure Booking
                          <CheckCircle2 size={20} />
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setStep(1)}
                      className="w-full text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-widest"
                    >
                      Back to selection
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-glass-border flex justify-center gap-4 opacity-30 grayscale">
              <span className="text-[10px] font-black tracking-tighter">VISA</span>
              <span className="text-[10px] font-black tracking-tighter">MASTERCARD</span>
              <span className="text-[10px] font-black tracking-tighter">AMEX</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
