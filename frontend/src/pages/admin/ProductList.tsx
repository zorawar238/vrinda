import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error fetching products');
      setProducts(data.products ? data.products : data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProductHandler = async () => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error creating product');
      navigate(`/admin/product/${data._id}/edit`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Error deleting product');
        }
        fetchProducts();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-4 border-foreground pb-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase">Products</h1>
        <button 
          onClick={createProductHandler}
          className="flex items-center gap-2 bg-primary text-background font-bold px-4 py-2 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-transform uppercase"
        >
          <Plus className="w-5 h-5" />
          Create Product
        </button>
      </div>

      {error && (
        <div className="mb-8 bg-red-500 text-white font-bold p-4 border-4 border-foreground uppercase">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-2xl font-bold uppercase">Loading Products...</div>
      ) : (
        <div className="overflow-x-auto bg-background border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(17,17,17,1)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary border-b-4 border-foreground">
                <th className="p-4 font-bold uppercase">ID</th>
                <th className="p-4 font-bold uppercase">Name</th>
                <th className="p-4 font-bold uppercase">Price</th>
                <th className="p-4 font-bold uppercase">Category</th>
                <th className="p-4 font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-foreground/20 hover:bg-secondary/50">
                  <td className="p-4 font-mono text-sm">{product._id}</td>
                  <td className="p-4 font-bold">{product.name}</td>
                  <td className="p-4 font-mono">₹{product.price}</td>
                  <td className="p-4 uppercase">{product.category}</td>
                  <td className="p-4 flex items-center gap-4">
                    <Link to={`/admin/product/${product._id}/edit`} className="p-2 hover:bg-primary hover:text-background border-2 border-transparent hover:border-foreground transition-colors">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => deleteHandler(product._id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-foreground transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
