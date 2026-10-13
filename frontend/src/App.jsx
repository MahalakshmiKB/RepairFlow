import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import StaffLogin from './pages/StaffLogin';
import DashboardOverview from './pages/DashboardOverview';
import AllRepairs from './pages/AllRepairs';
import NewRepair from './pages/NewRepair';
import EditRepair from './pages/EditRepair';
import RepairDetails from './pages/RepairDetails';
import CustomerTracking from './pages/CustomerTracking';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Staff Auth */}
        <Route path="/staff/login" element={<StaffLogin />} />

        {/* Public Repair Tracking (no login needed) */}
        <Route path="/track" element={<CustomerTracking />} />
        <Route path="/tracking" element={<CustomerTracking />} />

        {/* Staff Dashboard & Repair Management */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/repairs" element={<AllRepairs />} />
          <Route path="/repairs/new" element={<NewRepair />} />
          <Route path="/repairs/:id" element={<RepairDetails />} />
          <Route path="/repairs/:id/edit" element={<EditRepair />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
