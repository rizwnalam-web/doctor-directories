import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { User, LogOut, LayoutDashboard, Calendar, Stethoscope } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">Doctor Directories</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/doctors" className="text-gray-700 hover:text-primary transition">
              Find Doctors
            </Link>
            {user && (
              <Link to="/appointments" className="text-gray-700 hover:text-primary transition">
                Appointments
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to={
                  user.role === 'ADMIN' ? '/admin/dashboard' :
                  user.role === 'DOCTOR' ? '/doctor/dashboard' :
                  '/dashboard'
                }>
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
