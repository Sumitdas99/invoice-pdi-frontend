import { Outlet } from 'react-router-dom';
import { Sidebar, Header } from '../components';
import { useState } from 'react';

function Dashboard() {
  const savedExpandedState = localStorage.getItem('sidebarExpanded') === 'true';

  const [sidebarWidth, setSidebarWidth] = useState(
    savedExpandedState ? 240 : 60
  );

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar Component */}
      <Sidebar
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
        savedExpandedState={savedExpandedState}
      />

      {/* Main Content */}
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
