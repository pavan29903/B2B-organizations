import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ManageB2BOrganizations from './pages/ManageB2BOrganizations'
import OrganizationDetailsPage from './pages/OrganizationDetailsPage'

function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Test Page - Route is working!</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/organizations" replace />} />
        <Route path="/organizations" element={<ManageB2BOrganizations />} />
        <Route path="/organizations/:id" element={<OrganizationDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App
