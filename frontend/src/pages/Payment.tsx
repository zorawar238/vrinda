import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Payment = () => {
  const { shippingAddress, savePaymentMethod, paymentMethod } = useCart();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(paymentMethod || 'Razorpay');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(payment);
    navigate('/placeorder');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 lg:py-24 px-6 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-display tracking-wide mb-12 text-center">Payment Method</h1>
      
      <form onSubmit={submitHandler} className="space-y-8">
        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-6 text-center">Select Method</label>
          
          <div className="space-y-4">
            <label className={`flex items-center space-x-4 p-6 border transition-colors cursor-pointer ${payment === 'Razorpay' ? 'border-foreground bg-foreground/5' : 'border-foreground/20 hover:border-foreground/50'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="Razorpay" 
                checked={payment === 'Razorpay'}
                onChange={(e) => setPayment(e.target.value)}
                className="w-4 h-4 accent-foreground"
              />
              <span className="font-sans text-sm tracking-wide">Razorpay (Cards / UPI / NetBanking)</span>
            </label>

            <label className={`flex items-center space-x-4 p-6 border transition-colors cursor-pointer ${payment === 'Stripe' ? 'border-foreground bg-foreground/5' : 'border-foreground/20 hover:border-foreground/50'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="Stripe" 
                checked={payment === 'Stripe'}
                onChange={(e) => setPayment(e.target.value)}
                className="w-4 h-4 accent-foreground"
              />
              <span className="font-sans text-sm tracking-wide">Stripe</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 hover:bg-primary transition-colors mt-8"
        >
          Review Order
        </button>
      </form>
    </div>
  );
};

export default Payment;
