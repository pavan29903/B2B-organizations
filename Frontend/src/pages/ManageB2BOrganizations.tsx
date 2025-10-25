import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddOrganizationSidebar from "../components/AddOrganizationSidebar";

/*
  ManageB2BOrganizations.tsx
  - React + TypeScript component styled with Tailwind CSS
  - Self-contained mock data and responsive layout
  - Drop into your Vite/CRA Next project under src/components or pages

  Usage:
    - Place <ManageB2BOrganizations /> in a route/page
    - Replace mock data with API calls (e.g., react-query / fetch / axios)
*/

type OrgStatus = "active" | "blocked" | "inactive";

type Organization = {
  id: number;
  name: string;
  slug: string;
  organizationMail?: string;
  contact?: string;
  createdAt: string;
  logo?: string;
  pendingRequests: number;
  status: OrgStatus;
};

interface OrganizationData {
  name: string;
  slug: string;
  organizationMail: string;
  contact: string;
}

const MOCK_ORGS: Organization[] = [];


function StatusPill({ status }: { status: OrgStatus }) {
  const base = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium";
  if (status === "active")
    return <span className={`${base} bg-green-100 text-green-700`}>● Active</span>;
  if (status === "blocked")
    return <span className={`${base} bg-red-100 text-red-700`}>● Blocked</span>;
  return <span className={`${base} bg-gray-100 text-gray-600`}>● Inactive</span>;
}

export default function ManageB2BOrganizations() {
  const [orgs, setOrgs] = useState<Organization[]>(MOCK_ORGS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://b2b-organizations.onrender.com/api/organizations');
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((org: any) => ({
          ...org,
          logo: `https://avatars.dicebear.com/api/initials/${org.name.split(' ').map((n: string) => n[0]).join('')}.svg`,
          pendingRequests: 0,
          status: 'active' as OrgStatus
        }));
        setOrgs(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleAddOrganization = async (data: OrganizationData) => {
    setLoading(true);
    try {
      const response = await fetch('https://b2b-organizations.onrender.com/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await fetchOrganizations();
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Failed to add organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrganization = (org: Organization) => {
    navigate(`/organizations/${org.id}`);
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
            <button
              title="support"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12a9 9 0 0118 0v3a2 2 0 01-2 2h-1a2 2 0 01-2-2v-1a2 2 0 012-2h1V9a6 6 0 00-12 0v3h1a2 2 0 012 2v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-3z" />
              </svg>
            </button>
            <button
              title="notifications"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title + underline */}
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-purple-700">Manage B2B organizations</h1>
          <div className="mt-2 h-1 w-36 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-200" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2L2 8v8a2 2 0 002 2h12a2 2 0 002-2V8L10 2z" />
          </svg>
          <span>Manage B2B organizations</span>
          <div className="ml-auto">
            <button className="p-3 rounded-lg bg-purple-50 border border-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386-1.414 1.415-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card */}
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">B2B organizations</h2>

            <div>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
                Add organization
              </button>
            </div>
          </div>

          {/* Table header */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm text-gray-500">Sr. No</th>
                  <th className="px-6 py-4 text-sm text-gray-500">Organizations</th>
                  <th className="px-6 py-4 text-sm text-gray-500">Pending requests</th>
                  <th className="px-6 py-4 text-sm text-gray-500">Status</th>
                  <th className="px-6 py-4 text-sm text-gray-500">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Loading organizations...
                    </td>
                  </tr>
                ) : orgs.map((o, idx) => (
                  <tr key={o.id} className="border-b last:border-b-0">
                    <td className="px-6 py-5 align-middle text-sm text-gray-700 w-20">{idx + 1}</td>
                    <td className="px-6 py-5 align-middle flex items-center gap-4">
                      <img src={o.logo} alt={o.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{o.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">{o.pendingRequests} pending requests</td>
                    <td className="px-6 py-5">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 flex items-center gap-4">
                      <button 
                        title="view" 
                        onClick={() => handleViewOrganization(o)}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button title="delete" className="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Small footer / spacing */}
        <div className="h-20" />
      </main>
      
      <AddOrganizationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleAddOrganization}
      />
    </div>
  );
}
