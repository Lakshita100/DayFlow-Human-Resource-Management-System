import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col transition-all duration-300 lg:ml-64">
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
