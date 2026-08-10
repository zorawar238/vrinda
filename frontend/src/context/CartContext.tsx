import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  cartTotal: number;
  clearCart: () => void;
  shippingAddress: ShippingAddress;
  saveShippingAddress: (data: ShippingAddress) => void;
  paymentMethod: string;
  savePaymentMethod: (method: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sanitize: ensure all required fields exist and are correct types
        return parsed.filter((item: any) => 
          item && item._id && item.name && typeof item.price === 'number' && typeof item.qty === 'number' && item.image
        );
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('shippingAddress') : null;
    return saved ? JSON.parse(saved) : { address: '', city: '', postalCode: '', country: '' };
  });

  const [paymentMethod, setPaymentMethod] = useState<string>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('paymentMethod') : null;
    return saved ? JSON.parse(saved) : 'PayPal';
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
  }, [paymentMethod]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existItem = prev.find((x) => x._id === item._id && x.size === item.size);
      if (existItem) {
        return prev.map((x) =>
          x._id === existItem._id && x.size === item.size 
            ? { ...x, qty: x.qty + item.qty } 
            : x
        );
      } else {
        return [...prev, item];
      }
    });
    openCart();
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prev) => prev.filter((x) => !(x._id === id && x.size === size)));
  };

  const updateQuantity = (id: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((x) => (x._id === id && x.size === size ? { ...x, qty } : x))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const saveShippingAddress = (data: ShippingAddress) => {
    setShippingAddress(data);
  };

  const savePaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
