import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import { Wishlist } from './pages/Wishlist';
import { ProductList } from './pages/admin/ProductList';
import { ProductEdit } from './pages/admin/ProductEdit';
import { UserList } from './pages/admin/UserList';
import OrderList from './pages/admin/OrderList';
import AdminDashboard from './pages/admin/AdminDashboard';
import { FAQ } from './pages/FAQ';
import { ShippingReturns } from './pages/ShippingReturns';
import { ContactUs } from './pages/ContactUs';
import { TrackOrder } from './pages/TrackOrder';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <WishlistProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="collections" element={<Collections />} />
          <Route path="about" element={<About />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="payment" element={<Payment />} />
          <Route path="placeorder" element={<PlaceOrder />} />
          <Route path="order/:id" element={<Order />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="shipping-returns" element={<ShippingReturns />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="track-order" element={<TrackOrder />} />
          
          {/* Admin Routes */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/productlist" element={<ProductList />} />
          <Route path="admin/product/:id/edit" element={<ProductEdit />} />
          <Route path="admin/userlist" element={<UserList />} />
          <Route path="admin/orderlist" element={<OrderList />} />
        </Route>
      </Routes>
    </WishlistProvider>
  );
}

export default App;
