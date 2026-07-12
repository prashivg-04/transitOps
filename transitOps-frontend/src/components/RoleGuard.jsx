import { Navigate, useLocation } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAccess } from '../rbac';
import { getStoredUser } from '../hooks/useAuth';

/**
 * RoleGuard — wraps a page and enforces RBAC.
 *
 * - If not logged in: redirects to /login
 * - If role has 'none' access to this path: shows Access Denied screen
 * - If role has 'full' or 'view' access: renders children
 */
export default function RoleGuard({ children }) {
  const location = useLocation();
  const user = getStoredUser();

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const access = getAccess(location.pathname, user.role);

  if (access === 'none') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8 text-center select-none"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-lg shadow-rose-500/5">
          <ShieldX size={36} className="text-rose-400" />
        </div>

        {/* Copy */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Access Denied</h2>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Your role{' '}
            <span className="text-primary font-bold">{user.role}</span>{' '}
            does not have permission to view this page.
          </p>
        </div>

        {/* Role badge */}
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Role</span>
          <span className="text-xs font-bold text-primary border border-primary/20 bg-primary/10 rounded px-2 py-0.5">
            {user.role}
          </span>
        </div>

        {/* Info */}
        <p className="text-[10px] text-slate-600 max-w-xs">
          Contact your Fleet Manager or Superadmin to request access to this section.
        </p>
      </motion.div>
    );
  }

  return children;
}
