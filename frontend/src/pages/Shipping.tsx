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
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-black uppercase mb-8 tracking-tight">Shipping</h1>
      
      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block font-bold uppercase mb-2">Address</label>
          <input 
            type="text" 
            className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="123 Main St"
          />
        </div>

        <div>
          <label className="block font-bold uppercase mb-2">City</label>
          <input 
            type="text" 
            className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="New York"
          />
        </div>

        <div>
          <label className="block font-bold uppercase mb-2">Postal Code</label>
          <input 
            type="text" 
            className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            placeholder="10001"
          />
        </div>

        <div>
          <label className="block font-bold uppercase mb-2">Country</label>
          <input 
            type="text" 
            className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="USA"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-background font-black uppercase tracking-widest py-4 px-8 border-4 border-foreground hover:bg-foreground hover:text-background transition-all"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Shipping;
