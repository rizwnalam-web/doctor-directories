import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-white">Doctor Directories</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Find and book appointments with verified healthcare professionals in your area.
              Your health is our priority.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/doctors" className="text-sm hover:text-primary transition">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-primary transition">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm hover:text-primary transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@doctordirectories.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Health St, Medical City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Doctor Directories. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
