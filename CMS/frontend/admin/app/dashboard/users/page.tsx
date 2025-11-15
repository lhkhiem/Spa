'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, UserPlus, Users as UsersIcon, Search, Shield, Edit, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { buildApiUrl } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuthStore();
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const isOwner = currentUser?.role === 'owner';

  const fetchUsers = async () => {
    try {
      const res = await axios.get<any>(buildApiUrl('/api/users'), {
        withCredentials: true,
      });
      const data = (res.data && (res.data as any).data) ? (res.data as any).data as any[] : [];
      // map to UI type
      setUsers(
        data.map((u: any) => ({
          id: u.id,
          name: u.name || u.email,
          email: u.email,
          role: u.role || 'admin',
          status: (u.status as any) === 'inactive' ? 'inactive' : 'active',
          lastLogin: '',
        }))
      );
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateUser = async () => {
    try {
      // Basic client validation
      if (!form.name || !form.email || !form.password) {
        toast.error('Please fill in all fields');
        return;
      }
      if (form.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
      await axios.post(
        buildApiUrl('/api/users'),
        { ...form },
        { withCredentials: true }
      );
      toast.success('User created');
      setShowDialog(false);
      setForm({ name: '', email: '', password: '', role: 'admin' });
      fetchUsers();
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Create user failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users & Roles</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isOwner
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            onClick={() => isOwner ? setShowDialog(true) : undefined}
            title={isOwner ? 'Create a new user' : 'Insufficient permission'}
            disabled={!isOwner}
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="author">Author</option>
        </select>
        <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users yet"
          description="Start by adding team members and assigning roles. Configure permissions to control access to different parts of the CMS."
            action={{
              label: isOwner ? 'Add Your First User' : 'Insufficient permission',
              onClick: () => (isOwner ? setShowDialog(true) : toast.message('Insufficient permission')),
            }}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-accent/40 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button className="text-primary hover:underline inline-flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button className="text-destructive hover:underline inline-flex items-center gap-1">
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Roles Info */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role-Based Access Control (RBAC)
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-medium text-sm text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground mt-1">Full system access and user management</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-medium text-sm text-foreground">Editor</p>
            <p className="text-xs text-muted-foreground mt-1">Can publish and manage all content</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-medium text-sm text-foreground">Author</p>
            <p className="text-xs text-muted-foreground mt-1">Can create and edit own content</p>
          </div>
        </div>
      </div>

      {/* Create User Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDialog(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Add User</h3>
              <button onClick={() => setShowDialog(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                  placeholder="At least 8 chars, include numbers"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="author">Author</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className="px-3 py-2 rounded-lg border border-input text-sm" onClick={() => setShowDialog(false)}>Cancel</button>
              <button
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90"
                onClick={onCreateUser}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
