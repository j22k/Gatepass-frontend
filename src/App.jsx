import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import UnauthorizedPage from './pages/auth/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'
import LandingPage from './pages/LandingPage'
import WarehousePage from './pages/dashboards/WarehousePage'
import UserPage from './pages/dashboards/UserPage'
import VisitorTypePage from './pages/dashboards/VisitorTypePage'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import UserDashboard from './pages/dashboards/UserDashboard'
import ReceptionistDashboard from './pages/dashboards/ReceptionistDashboard'
import ApproverDashboard from './pages/dashboards/ApproverDashboard'
import WorkflowManagementPage from './pages/dashboards/WorkflowManagementPage'
import VisitorRequestsPage from './pages/dashboards/VisitorRequestsPage'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} /> 
          
          <Route path="/admin/admin-dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/reception/reception-dashboard" element={
            <ProtectedRoute>
              <ReceptionistDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/approver/approver-dashboard" element={
            <ProtectedRoute>
              <ApproverDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/user/user-dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/warehouses" element={
            <ProtectedRoute>
              <WarehousePage />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          } />
          
          <Route path="/visitor-types" element={
            <ProtectedRoute>
              <VisitorTypePage />
            </ProtectedRoute>
          } />

          <Route path="/workflow-management" element={
            <ProtectedRoute>
              <WorkflowManagementPage />
            </ProtectedRoute>
          } />
          
          <Route path="/visitor-requests" element={
            <ProtectedRoute>
              <VisitorRequestsPage />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFoundPage />} />  
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App