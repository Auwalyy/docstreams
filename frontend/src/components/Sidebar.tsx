import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, FileText, Car, Package, ClipboardList,
  Users, CalendarClock, Bell, BarChart2, Activity, LogOut, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
}

const NAV: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ict_admin', 'staff', 'supervisor', 'corporate_services', 'vehicle_officer', 'regional_coordinator', 'rom_supervisor'] },
  { to: '/facilities', icon: Building2, label: 'Facilities', roles: ['ict_admin', 'staff', 'supervisor', 'corporate_services', 'vehicle_officer', 'regional_coordinator', 'rom_supervisor'] },
  { to: '/documents', icon: FileText, label: 'Documents', roles: ['ict_admin', 'rom_supervisor', 'regional_coordinator'] },
  { to: '/vehicles', icon: Car, label: 'Vehicle Requests', roles: ['ict_admin', 'staff', 'supervisor', 'corporate_services', 'vehicle_officer', 'regional_coordinator'] },
  { to: '/items', icon: Package, label: 'Item Requests', roles: ['ict_admin', 'staff', 'supervisor', 'regional_coordinator'] },
  { to: '/inventory', icon: ClipboardList, label: 'Inventory', roles: ['ict_admin', 'staff', 'regional_coordinator', 'rom_supervisor'] },
  { to: '/staff', icon: Users, label: 'Staff', roles: ['ict_admin'] },
  { to: '/leave', icon: CalendarClock, label: 'Leave & Acting', roles: ['ict_admin', 'regional_coordinator'] },
  { to: '/notifications', icon: Bell, label: 'Notifications', roles: ['ict_admin', 'staff', 'supervisor', 'corporate_services', 'vehicle_officer', 'regional_coordinator', 'rom_supervisor'] },
  { to: '/reports', icon: BarChart2, label: 'Reports', roles: ['ict_admin', 'regional_coordinator'] },
  { to: '/activity', icon: Activity, label: 'Activity Log', roles: ['ict_admin'] },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const allowed = NAV.filter((n) => user && n.roles.includes(user.role));

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-green-700 text-white flex flex-col z-40">
      <div className="px-6 py-5 border-b border-green-600">
        <h1 className="text-xl font-bold tracking-wide">DocStream</h1>
        <p className="text-green-200 text-xs mt-0.5">Enterprise Operations</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {allowed.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-green-600 text-white' : 'text-green-100 hover:bg-green-600/60'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-green-600">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-green-300 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
          <ChevronDown size={14} className="text-green-300" />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-green-100 hover:bg-green-600/60 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};
