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
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-black uppercase mb-8 tracking-tight">Payment Method</h1>
      
      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block font-bold uppercase mb-4 text-xl">Select Method</label>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-4 p-4 border-4 border-foreground bg-secondary cursor-pointer hover:bg-background transition-colors">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="Razorpay" 
                checked={payment === 'Razorpay'}
                onChange={(e) => setPayment(e.target.value)}
                className="w-5 h-5 accent-primary"
              />
              <span className="font-bold text-lg">Razorpay (Cards / UPI / NetBanking)</span>
            </label>

            <label className="flex items-center space-x-4 p-4 border-4 border-foreground bg-secondary cursor-pointer hover:bg-background transition-colors">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="Cash on Delivery" 
                checked={payment === 'Cash on Delivery'}
                onChange={(e) => setPayment(e.target.value)}
                className="w-6 h-6 accent-primary"
              />
              <span className="font-bold text-lg uppercase">Stripe</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-background font-black uppercase tracking-widest py-4 px-8 border-4 border-foreground hover:bg-foreground hover:text-background transition-all mt-8"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Payment;
