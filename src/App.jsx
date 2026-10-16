import { Navigate, Route, Routes } from 'react-router-dom'
import { PreAuthRoute, ProtectedRoute } from './auth/routes'
import AdminDashboard from './pages/AdminDashboard'
import Authenticator from './pages/Authenticator'
import ChangePassword from './pages/ChangePassword'
import CustomerDashboard from './pages/CustomerDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import OAuthCallback from './pages/OAuthCallback'
import OtpEnroll from './pages/OtpEnroll'
import OtpVerify from './pages/OtpVerify'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/callback" element={<OAuthCallback />} />
      <Route path="/authenticator" element={<Authenticator />} />

      <Route path="/otp/verify" element={<PreAuthRoute><OtpVerify /></PreAuthRoute>} />
      <Route path="/otp/enroll" element={<PreAuthRoute><OtpEnroll /></PreAuthRoute>} />

      <Route path="/customer" element={<ProtectedRoute roles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/employee" element={<ProtectedRoute roles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}