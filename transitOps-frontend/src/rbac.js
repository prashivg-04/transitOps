// ─── RBAC Access Matrix ───────────────────────────────────────────────────────
// Access levels: 'full' | 'view' | 'none'
// Matches the table agreed in Settings > RBAC section.
//
// Backend UserRole enum values:
//   "Fleet Manager" | "Dispatcher" | "Safety Officer" | "Financial Analyst"

export const RBAC = {
  '/dashboard':     { 'Fleet Manager': 'full',  'Dispatcher': 'view', 'Safety Officer': 'view', 'Financial Analyst': 'view' },
  '/fleet':         { 'Fleet Manager': 'full',  'Dispatcher': 'view', 'Safety Officer': 'none', 'Financial Analyst': 'view' },
  '/drivers':       { 'Fleet Manager': 'view',  'Dispatcher': 'view', 'Safety Officer': 'full', 'Financial Analyst': 'none' },
  '/trips':         { 'Fleet Manager': 'view',  'Dispatcher': 'full', 'Safety Officer': 'view', 'Financial Analyst': 'view' },
  '/maintenance':   { 'Fleet Manager': 'full',  'Dispatcher': 'none', 'Safety Officer': 'none', 'Financial Analyst': 'view' },
  '/fuel-expenses': { 'Fleet Manager': 'view',  'Dispatcher': 'none', 'Safety Officer': 'none', 'Financial Analyst': 'full' },
  '/analytics':     { 'Fleet Manager': 'full',  'Dispatcher': 'none', 'Safety Officer': 'none', 'Financial Analyst': 'full' },
  '/settings':      { 'Fleet Manager': 'full',  'Dispatcher': 'view', 'Safety Officer': 'view', 'Financial Analyst': 'view' },
};

/**
 * Returns the access level for a given route and role.
 * @param {string} path  - Route path e.g. '/fleet'
 * @param {string} role  - Backend role value e.g. 'Fleet Manager'
 * @returns {'full'|'view'|'none'}
 */
export const getAccess = (path, role) => {
  if (!role) return 'none';
  const entry = RBAC[path];
  if (!entry) return 'none';
  return entry[role] ?? 'none';
};

/**
 * Returns true if the role can see the route at all (full or view).
 */
export const canAccess = (path, role) => {
  return getAccess(path, role) !== 'none';
};

/**
 * First accessible route for a given role — used to redirect after login.
 */
export const defaultRouteForRole = (role) => {
  for (const [path] of Object.entries(RBAC)) {
    if (canAccess(path, role)) return path;
  }
  return '/dashboard';
};
