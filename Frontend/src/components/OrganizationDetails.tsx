
interface Organization {
  id: number;
  name: string;
  slug: string;
  organizationMail?: string;
  contact?: string;
  createdAt: string;
}

interface OrganizationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
}

export default function OrganizationDetails({ isOpen, onClose, organization }: OrganizationDetailsProps) {
  if (!isOpen || !organization) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-1/2 bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Organization Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={`https://avatars.dicebear.com/api/initials/${organization.name.split(' ').map(n => n[0]).join('')}.svg`}
                alt={organization.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{organization.name}</h3>
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-700">
                  ● Active
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Organization details</h4>
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

              <div>
                <h4 className="text-lg font-medium mb-4">Contact details</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Email</label>
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

              <div>
                <h4 className="text-lg font-medium mb-4">Additional Information</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {new Date(organization.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization ID</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      #{organization.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}