import React from 'react';
import { Search, UserCheck, UserX, MoreVertical, Filter, ShieldCheck } from 'lucide-react';

const Users = () => {
  const users = [
    { id: '1', name: 'Rahul Kumar', email: 'rahul@example.com', role: 'SELLER', status: 'Active', joined: 'Oct 2023' },
    { id: '2', name: 'Alice Smith', email: 'alice@example.com', role: 'CUSTOMER', status: 'Active', joined: 'Nov 2023' },
    { id: '3', name: 'Hardeep Singh', email: 'hardeep@farm.co', role: 'SELLER', status: 'Blocked', joined: 'Aug 2023' },
    { id: '4', name: 'Priya Verma', email: 'priya@gmail.com', role: 'CUSTOMER', status: 'Active', joined: 'Dec 2023' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">User Management</h1>
          <p className="text-text-secondary mt-1">Manage all platform participants across roles.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input type="text" placeholder="Search by name, email or ID..." className="input-field w-full pl-12 py-3" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="btn-secondary bg-bg-surface text-text-secondary px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" /> All Roles
          </button>
          <button className="btn-secondary bg-bg-surface text-text-secondary px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" /> Status
          </button>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-surface/50 text-text-secondary text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Joined</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/10">
              {users.map(user => (
                <tr key={user._id || user.id} className="hover:bg-bg-surface/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider ${
                      user.role === 'SELLER' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{user.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                       <span className="text-xs font-medium">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {user.status === 'Active' ? (
                          <button className="p-2 text-text-secondary hover:text-red-500 transition-colors" title="Block User">
                            <UserX className="w-5 h-5" />
                          </button>
                       ) : (
                          <button className="p-2 text-text-secondary hover:text-emerald-500 transition-colors" title="Unblock User">
                            <UserCheck className="w-5 h-5" />
                          </button>
                       )}
                       <button className="p-2 text-text-secondary hover:text-white transition-colors">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
