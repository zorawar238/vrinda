import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export function ProductEdit() {
  const { id: productId } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  
  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Product not found');
        
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images || []);
        setCategory(data.category);
        setStock(data.stock);
        setDescription(data.description);
        setIsTrending(data.isTrending || false);
        setSizes(data.sizes || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, userInfo, navigate]);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Image upload failed');
      
      setImage(data.image);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));
    setUploading(true);

    try {
      const res = await fetch('/api/upload/multiple', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Image upload failed');
      
      setImages((prev) => [...prev, ...data.images]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name, price, image, images, category, stock, description, isTrending, sizes
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product');
      
      navigate('/admin/productlist');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-4xl">LOADING...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
      <Link to="/admin/productlist" className="inline-flex items-center gap-2 font-bold hover:text-primary transition-colors mb-8 uppercase">
        <ArrowLeft className="w-5 h-5" /> Go Back
      </Link>

      <div className="bg-background border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] p-8">
        <h1 className="text-4xl font-display font-bold uppercase mb-8 border-b-4 border-foreground pb-4">
          Edit Product
        </h1>

        {error && (
          <div className="mb-6 bg-red-500 text-white font-bold p-4 border-2 border-foreground uppercase">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block font-bold uppercase mb-2">Name</label>
            <input 
              type="text" 
              className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold uppercase mb-2">Price (₹)</label>
              <input 
                type="number" 
                className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block font-bold uppercase mb-2">Stock Count</label>
              <input 
                type="number" 
                className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Image URL</label>
            <input 
              type="text" 
              className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors mb-2"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
            <input 
              type="file"
              onChange={uploadFileHandler}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-background
                hover:file:bg-primary/80"
            />
            {uploading && <div className="mt-2 text-sm font-bold uppercase text-primary">Uploading image...</div>}
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Additional Images</label>
            {images.length > 0 && (
              <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 flex-shrink-0 border-2 border-foreground group">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-none hover:bg-foreground transition-colors opacity-0 group-hover:opacity-100"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input 
              type="file"
              multiple
              onChange={uploadMultipleFileHandler}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-background
                hover:file:bg-primary/80"
            />
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Category</label>
            <input 
              type="text" 
              className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Description</label>
            <textarea 
              className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors h-32 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-bold uppercase mb-4">Sizes Available</label>
            <div className="flex flex-wrap gap-4">
              {AVAILABLE_SIZES.map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer bg-secondary p-3 border-4 border-foreground hover:bg-background transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-primary"
                    checked={sizes.includes(size)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSizes([...sizes, size]);
                      } else {
                        setSizes(sizes.filter((s) => s !== size));
                      }
                    }}
                  />
                  <span className="font-bold">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input 
              type="checkbox" 
              id="isTrending"
              className="w-6 h-6 border-4 border-foreground accent-primary"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
            />
            <label htmlFor="isTrending" className="font-bold uppercase">Mark as Trending Feature</label>
          </div>

          <button 
            type="submit" 
            disabled={updateLoading}
            className="w-full bg-primary text-background font-display font-bold text-2xl py-4 border-4 border-foreground hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all uppercase disabled:opacity-50 mt-8"
          >
            {updateLoading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
