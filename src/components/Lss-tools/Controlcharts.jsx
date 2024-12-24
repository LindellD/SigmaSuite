// src/components/lss-tools/ControlCharts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';

const ControlCharts = ({ data, columns }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [chartData, setChartData] = useState([]);
  const [controlLimits, setControlLimits] = useState({
    ucl: 0, // Upper Control Limit
    lcl: 0, // Lower Control Limit
    cl: 0   // Center Line (mean)
  });

  useEffect(() => {
    if (data && data.length > 0 && selectedColumn) {
      calculateControlLimits();
    }
  }, [selectedColumn, data]);

  const calculateControlLimits = () => {
    if (!selectedColumn || !data || data.length === 0) return;
  
    // Obtener valores numéricos válidos
    const values = data
      .map(row => parseFloat(row[selectedColumn]))
      .filter(val => !isNaN(val) && val !== null);
  
    if (values.length === 0) return;
  
    // Calcular media
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
  
    // Calcular desviación estándar
    const stdDev = Math.sqrt(
      values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
    );
  
    // Calcular límites de control (±3 sigma)
    setControlLimits({
      ucl: mean + (3 * stdDev)/1.5,
      lcl: mean - (3 * stdDev)/1.9,
      cl: mean
    });
  
    // Preparar datos para el gráfico manteniendo el orden original
    const processedData = values.map((value, index) => ({
      index: index + 1,  // Número de observación
      value: value
    }));
  
    setChartData(processedData);
  };

  if (!data || !columns || columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-4">
          No hay datos disponibles para generar gráficos de control
        </p>
        <Link to="/upload" className="text-blue-600 hover:text-blue-700">
          Ir a cargar datos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gráfico de Control</h2>

        {/* Selector de columna */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar variable a monitorear
          </label>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seleccione una columna</option>
            {columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>

        {/* Gráfico de control */}
        {selectedColumn && chartData.length > 0 && (
  <div className="h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
    <LineChart 
        data={chartData} 
        margin={{ top: 30, right: 80, left: 40, bottom: 30 }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
            dataKey="index"
            label={{ value: 'Número de observación', position: 'bottom' }}
            tick={{ fontSize: 12 }}
        />
        <YAxis 
            label={{ value: selectedColumn, angle: -90, position: 'insideLeft', offset: -5 }}
            domain={[
            dataMin => Math.floor(Math.min(dataMin, controlLimits.lcl)),
            dataMax => Math.ceil(Math.max(dataMax, controlLimits.ucl))
            ]}
            tick={{ fontSize: 12 }}
        />
        <Tooltip />
        
        {/* Líneas de control */}
        <ReferenceLine 
            y={controlLimits.ucl} 
            label={{ 
            value: `LSC: ${controlLimits.ucl.toFixed(2)}`,
            position: 'right',
            fill: 'red'
            }} 
            stroke="red" 
            strokeWidth={2}
        />
        <ReferenceLine 
            y={controlLimits.cl} 
            label={{ 
            value: `LC: ${controlLimits.cl.toFixed(2)}`,
            position: 'right',
            fill: 'green'
            }} 
            stroke="green"
            strokeWidth={2}
        />
        <ReferenceLine 
            y={controlLimits.lcl} 
            label={{ 
            value: `LIC: ${controlLimits.lcl.toFixed(2)}`,
            position: 'right',
            fill: 'red'
            }} 
            stroke="red" 
            strokeWidth={2}
        />
        
        <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
            activeDot={{ r: 6, fill: '#2563eb' }}
        />
        </LineChart>
    </ResponsiveContainer>
  </div>
)}

        {/* Información estadística */}
        {selectedColumn && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Límite Superior (UCL)</p>
              <p className="text-lg font-semibold">{controlLimits.ucl.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Línea Central (CL)</p>
              <p className="text-lg font-semibold">{controlLimits.cl.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Límite Inferior (LCL)</p>
              <p className="text-lg font-semibold">{controlLimits.lcl.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Información sobre gráficos de control */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">¿Qué son los Gráficos de Control?</h3>
        <p className="text-gray-700 mb-4">
          Los gráficos de control son herramientas estadísticas utilizadas para:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Monitorear la estabilidad del proceso</li>
          <li>Detectar variaciones especiales vs. variaciones comunes</li>
          <li>Establecer límites de control basados en ±3 sigma</li>
          <li>Identificar cuando un proceso está fuera de control</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlCharts;