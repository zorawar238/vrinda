import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { userInfo } = useAuth();
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('wishlistItems') : null;
    return saved ? JSON.parse(saved) : [];
  });

  // Sync wishlist from backend when user logs in
  useEffect(() => {
    const syncWithBackend = async () => {
      if (userInfo && userInfo.token) {
        try {
          // If we have local items, let's sync them to the backend
          if (wishlistItems.length > 0) {
            const res = await fetch('/api/users/wishlist', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
              },
              body: JSON.stringify(wishlistItems),
            });
            if (res.ok) {
              const data = await res.json();
              // The backend returns the merged wishlist
              const formattedData = data.map((x: any) => ({
                _id: x.product ? x.product.toString() : x._id,
                name: x.name,
                price: x.price,
                image: x.image,
              }));
              setWishlistItems(formattedData);
              return;
            }
          }
          
          // If no local items or sync failed, just load what's on the account
          if (userInfo.wishlist && userInfo.wishlist.length > 0) {
             const formattedData = userInfo.wishlist.map((x: any) => ({
                _id: x.product ? x.product.toString() : x._id,
                name: x.name,
                price: x.price,
                image: x.image,
              }));
              setWishlistItems(formattedData);
          }
        } catch (error) {
          console.error("Failed to sync wishlist", error);
        }
      }
    };
    
    syncWithBackend();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]); // Only run when token changes (login/logout)

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = async (item: WishlistItem) => {
    setWishlistItems((prev) => {
      if (!prev.find((x) => x._id === item._id)) {
        return [...prev, item];
      }
      return prev;
    });

    if (userInfo && userInfo.token) {
      try {
        await fetch('/api/users/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify(item),
        });
      } catch (error) {
        console.error("Failed to add to backend wishlist", error);
      }
    }
  };

  const removeFromWishlist = async (id: string) => {
    setWishlistItems((prev) => prev.filter((x) => x._id !== id));

    if (userInfo && userInfo.token) {
      try {
        await fetch(`/api/users/wishlist/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
      } catch (error) {
        console.error("Failed to remove from backend wishlist", error);
      }
    }
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((x) => x._id === id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
