import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';

export function Layout() {
  const location = useLocation();
  const isStyleFeed = location.pathname.includes('/style-feed');

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {!isStyleFeed && (
        <>
          {/* Announcement Bar */}
          <div className="bg-foreground text-background text-xs sm:text-sm font-medium tracking-widest text-center py-2 uppercase">
            ✦ NEW DROP IS HERE ✦
          </div>
          <Header />
        </>
      )}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isStyleFeed && <Footer />}
      <CartDrawer />
    </div>
  );
}
