import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 lg:py-24 px-6 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-display tracking-wide mb-12 text-center">Shipping Details</h1>
      
      <form onSubmit={submitHandler} className="space-y-8">
        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Address</label>
          <input 
            type="text" 
            className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="123 Main St"
          />
        </div>

        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">City</label>
          <input 
            type="text" 
            className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="New York"
          />
        </div>

        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Postal Code</label>
          <input 
            type="text" 
            className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            placeholder="10001"
          />
        </div>

        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Country</label>
          <input 
            type="text" 
            className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="USA"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 hover:bg-primary transition-colors mt-8"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default Shipping;
