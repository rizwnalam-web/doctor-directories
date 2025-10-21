import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to role-specific dashboard
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'DOCTOR') {
    return <Navigate to="/doctor/dashboard" replace />;
  }

  return <Navigate to="/profile" replace />;
}
