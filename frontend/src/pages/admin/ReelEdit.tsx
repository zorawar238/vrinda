import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Product {
  _id: string;
  name: string;
}

export const ReelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [productId, setProductId] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const isCreating = id === 'create';

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=100');
        const data = await res.json();
        setProducts(data.products || data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();

    if (!isCreating) {
      const fetchReel = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/reels/${id}`);
          if (!res.ok) throw new Error('Reel not found');
          const data = await res.json();
          setVideoUrl(data.videoUrl);
          setThumbnailUrl(data.thumbnailUrl || '');
          setCaption(data.caption);
          setProductId(data.product?._id || data.product);
          setIsPublished(data.isPublished);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchReel();
    }
  }, [id, navigate, userInfo, isCreating]);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    if (type === 'video') {
      formData.append('video', file);
    } else {
      formData.append('image', file);
    }

    setUploading(true);
    try {
      const endpoint = type === 'video' ? '/api/upload/video' : '/api/upload';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      
      if (type === 'video') {
        setVideoUrl(data.video);
      } else {
        setThumbnailUrl(data.image);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const reelData = {
        videoUrl,
        thumbnailUrl,
        caption,
        product: productId,
        isPublished,
      };

      const url = isCreating ? '/api/reels' : `/api/reels/${id}`;
      const method = isCreating ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify(reelData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      
      navigate('/admin/reels');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-24 px-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <button onClick={() => navigate('/admin/reels')} className="text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground">
          &larr; Back to Reels
        </button>
        <h1 className="text-3xl font-display uppercase tracking-widest mt-4">
          {isCreating ? 'Create Reel' : 'Edit Reel'}
        </h1>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 mb-6 text-sm">{error}</div>}

      <form onSubmit={submitHandler} className="space-y-6 font-sans">
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => uploadFileHandler(e, 'video')}
            className="w-full border border-foreground/20 p-3 text-sm focus:outline-none focus:border-primary"
          />
          {uploading && <p className="text-xs mt-2 text-foreground/50">Uploading...</p>}
          {videoUrl && (
            <div className="mt-4">
              <video src={videoUrl} controls className="w-full max-w-[200px] bg-black" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Thumbnail (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadFileHandler(e, 'image')}
            className="w-full border border-foreground/20 p-3 text-sm focus:outline-none focus:border-primary"
          />
          {thumbnailUrl && (
            <div className="mt-4">
              <img src={thumbnailUrl} alt="Thumbnail" className="w-full max-w-[200px] object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Associated Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full border border-foreground/20 p-3 text-sm focus:outline-none focus:border-primary"
            required
          >
            <option value="">Select a Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Caption (Optional)</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border border-foreground/20 p-3 text-sm focus:outline-none focus:border-primary h-24"
            placeholder="Add a caption..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="isPublished" className="text-sm tracking-wide">Publish Reel</label>
        </div>

        <button
          type="submit"
          disabled={loading || uploading || !videoUrl || !productId}
          className="w-full bg-foreground text-background py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Reel'}
        </button>
      </form>
    </div>
  );
};
