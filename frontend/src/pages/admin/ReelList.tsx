import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Reel {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  isPublished: boolean;
  product?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export const ReelList = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchReels();
  }, [userInfo, navigate]);

  const fetchReels = async () => {
    try {
      const response = await fetch('/api/reels/all', {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reels');
      }
      const data = await response.json();
      setReels(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reel?')) {
      try {
        const response = await fetch(`/api/reels/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        if (response.ok) {
          fetchReels();
        } else {
          alert('Failed to delete reel');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete reel');
      }
    }
  };

  const createReelHandler = async () => {
    navigate('/admin/reel/create/edit');
  };

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display uppercase tracking-widest">Reels</h1>
        <button
          onClick={createReelHandler}
          className="flex items-center gap-2 bg-foreground text-background px-6 py-3 font-sans text-xs uppercase tracking-widest hover:bg-primary transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Reel
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-muted text-foreground uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Video</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Published</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reels.map((reel) => (
                <tr key={reel._id} className="border-b border-foreground/10 hover:bg-muted/30">
                  <td className="px-6 py-4 text-xs tracking-wider">{reel._id.substring(0, 8)}...</td>
                  <td className="px-6 py-4">
                    {reel.videoUrl ? (
                      <video src={reel.videoUrl} className="w-16 h-16 object-cover bg-black" muted />
                    ) : (
                      'No video'
                    )}
                  </td>
                  <td className="px-6 py-4">{reel.product?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {reel.isPublished ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <Link to={`/admin/reel/${reel._id}/edit`} className="text-foreground/70 hover:text-primary">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteHandler(reel._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
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
};
