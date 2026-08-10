import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [userInfo, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error fetching users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Error deleting user');
        }
        fetchUsers();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const toggleAdminHandler = async (id: string, isAdmin: boolean) => {
    if (window.confirm(`Are you sure you want to ${isAdmin ? 'remove' : 'make'} this user an admin?`)) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`,
          },
          body: JSON.stringify({ isAdmin: !isAdmin }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Error updating user role');
        }
        fetchUsers();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-4 border-foreground pb-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase">Users</h1>
      </div>

      {error && (
        <div className="mb-8 bg-red-500 text-white font-bold p-4 border-4 border-foreground uppercase">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-2xl font-bold uppercase">Loading Users...</div>
      ) : (
        <div className="overflow-x-auto bg-background border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(17,17,17,1)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary border-b-4 border-foreground">
                <th className="p-4 font-bold uppercase">ID</th>
                <th className="p-4 font-bold uppercase">Name</th>
                <th className="p-4 font-bold uppercase">Email</th>
                <th className="p-4 font-bold uppercase">Role</th>
                <th className="p-4 font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-foreground/20 hover:bg-secondary/50">
                  <td className="p-4 font-mono text-sm">{user._id}</td>
                  <td className="p-4 font-bold">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 font-bold uppercase flex items-center gap-2">
                    {user.isAdmin ? (
                      <span className="text-primary flex items-center gap-1"><Shield className="w-4 h-4" /> Admin</span>
                    ) : (
                      <span className="text-gray-500 flex items-center gap-1"><UserIcon className="w-4 h-4" /> User</span>
                    )}
                  </td>
                  <td className="p-4">
                    {user._id !== userInfo?._id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAdminHandler(user._id, user.isAdmin)}
                          className="px-3 py-1 bg-secondary text-foreground border-2 border-foreground hover:bg-foreground hover:text-background font-bold text-sm uppercase transition-colors"
                        >
                          {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                        {!user.isAdmin && (
                          <button 
                            onClick={() => deleteHandler(user._id)}
                            className="p-2 text-red-500 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-foreground transition-colors title='Delete User'"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    )}
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
