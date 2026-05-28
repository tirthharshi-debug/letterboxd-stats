import { useState } from 'react';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [dashboardData, setDashboardData] = useState(null);

  if (!dashboardData) {
    return <UploadPage onDataLoaded={setDashboardData} />;
  }

  return <Dashboard data={dashboardData} />;
}
