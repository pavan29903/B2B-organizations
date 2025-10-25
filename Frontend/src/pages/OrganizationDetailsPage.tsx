import React, { useState } from 'react';
import AddUserSidebar from '../components/AddUserSidebar';

interface Organization {
  id: number;
  name: string;
  slug: string;
  organizationMail?: string;
  contact?: string;
  createdAt: string;
}

interface OrganizationDetailsPageProps {
  organization: Organization;
  onBack: () => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserData {
  name: string;
  role: string;
}

// const MOCK_USERS: User[] = [
//   { id: 1, name: 'Dave Richards', email: 'dave@gitam.in', role: 'Admin' },
//   { id: 2, name: 'Abhishek Hari', email: 'abhishek@gitam.in', role: 'Co-ordinator' },
//   { id: 3, name: 'Nishta Gupta', email: 'nishta@gitam.in', role: 'Admin' }
// ];

export default function OrganizationDetailsPage({ organization, onBack }: OrganizationDetailsPageProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/organizations/${organization.id}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, organization.id]);

  const handleAddUser = async (userData: UserData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/organizations/${organization.id}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        await fetchUsers();
        setIsAddUserOpen(false);
      }
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      'Admin': 'bg-green-100 text-green-700',
      'Co-ordinator': 'bg-orange-100 text-orange-700',
      'User': 'bg-blue-100 text-blue-700'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top nav */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-28">
              <div className="font-bold text-lg border-2 rounded-sm px-2 py-1 inline-block">LOGO</div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
              <span className="text-gray-400">Dashboard</span>
              <span className="text-purple-600 font-medium">Manage B2B organizations</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button title="help" className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12a9 9 0 1118 0v3a2 2 0 01-2 2h-1a2 2 0 01-2-2v-1" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-200" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2L2 8v8a2 2 0 002 2h12a2 2 0 002-2V8L10 2z" />
          </svg>
          <button onClick={onBack} className="hover:text-purple-600">Manage B2B organizations</button>
          <span>›</span>
          <span>Organization details</span>
        </div>

        {/* Organization Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={`https://avatars.dicebear.com/api/initials/${organization.name.split(' ').map(n => n[0]).join('')}.svg`}
                alt={organization.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-semibold text-purple-700">{organization.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>📧 {organization.organizationMail || 'No email'}</span>
                  <span>📞 {organization.contact || 'No contact'}</span>
                  <span>🌐 {organization.slug}.com</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-700">
                ● Active
              </span>
              <button className="px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50">
                Change status
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b">
            <nav className="flex">
              <button 
                onClick={() => setActiveTab('basic')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'basic' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Basic details
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'users' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'basic' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Profile</h2>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

            <div className="space-y-8">
              {/* Organization details */}
              <div>
                <h3 className="text-base font-medium mb-4">Organization details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization name</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {organization.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization SLUG</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {organization.slug}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <div>
                <h3 className="text-base font-medium mb-4">Contact details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Admin Mail Id</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {organization.organizationMail || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone no</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {organization.contact || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional settings */}
              <div>
                <h3 className="text-base font-medium mb-4">Maximum Allowed Coordinators</h3>
                <div className="w-64">
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <option>Upto 5 Coordinators</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-4">Timezone</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Common name</label>
                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <option>India Standard Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <option>Asia/Colombo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-4">Language</h3>
                <div className="w-64">
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <option>English</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium mb-4">Official website URL</h3>
                <div className="w-64">
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    {organization.slug}.com
                  </div>
                </div>
              </div>
            </div>
              </>
            )}

            {activeTab === 'users' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Users</h2>
                  <button 
                    onClick={() => setIsAddUserOpen(true)}
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add user
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Sr. No</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user, index) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <AddUserSidebar
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
}