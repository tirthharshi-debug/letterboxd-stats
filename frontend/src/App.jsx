import { useState } from 'react';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [jobId, setJobId] = useState(null);

  const handleDataLoaded = (data, id) => {
    setDashboardData(data);
    setJobId(id);
  };

  if (!dashboardData) {
    return <UploadPage onDataLoaded={handleDataLoaded} />;
  }

  return <Dashboard data={dashboardData} jobId={jobId} />;
}
