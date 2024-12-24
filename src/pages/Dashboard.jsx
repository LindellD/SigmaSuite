import React, { useState } from 'react';
import FileUpload from './components/fileupload/FileUpload';
import Dashboard from './components/dashboard/Dashboard';
const DashboardPage = () => {
  const [processedData, setProcessedData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const handleDataLoad = (data, columns) => {
    setProcessedData(data);
    setSelectedColumns(columns);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!processedData ? (
        <div className="p-6">
          <FileUpload onDataLoad={handleDataLoad} />
        </div>
      ) : (
        <Dashboard data={processedData} />
      )}
    </div>
  );
};

export default DashboardPage;