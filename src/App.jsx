import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import FileUploadPage from './pages/FileUploadPage';
import Dashboard from './components/dashboard/Dashboard';
import Statistics from './pages/Statistics';
import LSSTools from './pages/LSSTools';
import ParetoChart from './components/Lss-tools/ParetoChart';
import IshikawaDiagram from './components/Lss-tools/IshikawaDiagram';
import ControlCharts from './components/Lss-tools/ControlCharts';
import ScatterPlot from './components/Lss-tools/ScatterPlot';
import CheckSheet from './components/Lss-tools/CheckSheet';
import Stratification from './components/Lss-tools/Stratification';
import Histogram from './components/Lss-tools/Histogram';
import SixSigmaCalculator from './components/SixSigmaCalculator/SixSigmaCalculator';
import Reports from './components/Reports/Reports';


function App() {
  const [processedData, setProcessedData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const handleDataLoad = (data, columns) => {
    setProcessedData(data);
    setSelectedColumns(columns);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Layout />}>
          <Route 
            path="upload" 
            element={<FileUploadPage onDataLoad={handleDataLoad} />} 
          />
          <Route 
            path="dashboard" 
            element={<Dashboard data={processedData} columns={selectedColumns} />} 
          />
          <Route 
            path="statistics" 
            element={<Statistics data={processedData} columns={selectedColumns} />} 
          />
          <Route path="lss-tools" element={<LSSTools />} />
          
            <Route path="lss-tools/pareto" element={<ParetoChart 
            data={processedData} columns={selectedColumns} />} />

            <Route path="lss-tools/ishikawa" element={<IshikawaDiagram />} />

            <Route path="lss-tools/control-charts" element={<ControlCharts
             data={processedData} columns={selectedColumns} />} />

            <Route path="lss-tools/scatter" element={<ScatterPlot data={processedData} 
            columns={selectedColumns} />} />

            <Route path="lss-tools/check-sheet" element={<CheckSheet />} />

            <Route path="lss-tools/stratification" element={<Stratification 
            data={processedData} columns={selectedColumns} />} />   

            <Route path="lss-tools/histogram" element={<Histogram data={processedData} columns={selectedColumns} />} />

         <Route path="SixSigmaCalculator" element={<SixSigmaCalculator />} />       
        
         <Route 
              path="reports" 
              element={<Reports data={processedData} columns={selectedColumns} />} 
            />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;