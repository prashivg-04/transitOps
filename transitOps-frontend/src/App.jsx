import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import FeatureGrid from './components/FeatureGrid';
import DashboardShowcase from './components/DashboardShowcase';
import Workflow from './components/Workflow';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Auth from './components/Auth';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './components/DashboardPage';
import PlaceholderPage from './components/PlaceholderPage';
import { Truck, Users, Route as RouteIcon, Wrench, DollarSign, BarChart3, Settings } from 'lucide-react';

function LandingView({ onNavigate }) {
  return (
    <div className="relative min-h-screen bg-slate-50 text-secondary selection:bg-primary/10 selection:text-primary">
      {/* Dynamic Background Blob elements */}
      <div className="absolute top-[20%] left-[-100px] w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-100px] w-[600px] h-[600px] rounded-full bg-accent/5 filter blur-[140px] pointer-events-none" />

      {/* Global Navigation Header */}
      <Navbar onNavigate={onNavigate} />

      {/* Main Sections Content */}
      <main>
        <Hero onNavigate={onNavigate} />
        <Metrics />
        <FeatureGrid />
        <DashboardShowcase />
        <Workflow />
        <Benefits />
        <Testimonials />
        <Pricing onNavigate={onNavigate} />
        <FAQ />
      </main>

      {/* Global Premium Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  const handleNavigate = (target) => {
    if (target === 'login') navigate('/login');
    else if (target === 'signup') navigate('/signup');
    else navigate('/');
  };

  return (
    <Routes>
      {/* Landing marketing page */}
      <Route path="/" element={<LandingView onNavigate={handleNavigate} />} />
      
      {/* Auth views redirects */}
      <Route 
        path="/login" 
        element={
          <Auth
            initialView="login"
            onBack={() => navigate('/')}
            onSuccess={() => navigate('/dashboard')}
          />
        } 
      />
      <Route 
        path="/signup" 
        element={
          <Auth
            initialView="signup"
            onBack={() => navigate('/')}
            onSuccess={() => navigate('/dashboard')}
          />
        } 
      />

      {/* Dashboard Subrouter Outlet Layout */}
      <Route element={<DashboardLayout onLogout={() => navigate('/')} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route 
          path="/fleet" 
          element={
            <PlaceholderPage 
              title="Fleet Registry" 
              description="Manage active fleet vehicles, specification catalogs, live hardware tracking markers and registration compliance diaries." 
              icon={Truck} 
            />
          } 
        />
        <Route 
          path="/drivers" 
          element={
            <PlaceholderPage 
              title="Driver Roster" 
              description="Monitor driver logging records, hours of service limit rosters, safety metric points and communication channels." 
              icon={Users} 
            />
          } 
        />
        <Route 
          path="trips" 
          element={
            <PlaceholderPage 
              title="Dispatch & Smart Trips" 
              description="Coordinate live load dispatches, calculate automated green routing paths, check ETA logs and customer receipt statuses." 
              icon={RouteIcon} 
            />
          } 
        />
        <Route 
          path="/maintenance" 
          element={
            <PlaceholderPage 
              title="Preventive Maintenance" 
              description="Inspect active maintenance plans, scheduler work cards, mechanic reports, and parts stock audits." 
              icon={Wrench} 
            />
          } 
        />
        <Route 
          path="/fuel-expenses" 
          element={
            <PlaceholderPage 
              title="Fuel & Fleet Expenses" 
              description="Audit fleet spending statistics, check instant fuel card registers, evaluate engine run-times and tax logs." 
              icon={DollarSign} 
            />
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <PlaceholderPage 
              title="Operations Intelligence" 
              description="Compile customized intelligence reports, look at fuel efficiency charts, dispatch speeds and idle stats." 
              icon={BarChart3} 
            />
          } 
        />
        <Route 
          path="/settings" 
          element={
            <PlaceholderPage 
              title="Workspace Settings" 
              description="Configure account configurations, adjust RBAC permissions, integrate developer API tokens and configure alerts." 
              icon={Settings} 
            />
          } 
        />
      </Route>

      {/* Fallback unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default App;
