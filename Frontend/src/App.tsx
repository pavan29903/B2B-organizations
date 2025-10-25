import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ManageB2BOrganizations from './pages/ManageB2BOrganizations'
import OrganizationDetailsPage from './pages/OrganizationDetailsPage'

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
