
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { AlertCircle } from 'lucide-react';

const ParetoChart = ({ data, columns }) => {
  const [paretoData, setParetoData] = useState([]);

  useEffect(() => {
    if (data && columns) {
      prepareParetoData();
    }
  }, [data, columns]);

  const prepareParetoData = () => {
    // Paso 1: Contar frecuencias
    const frequencies = {};
    data.forEach(row => {
      columns.forEach(column => {
        const value = row[column];
        if (value) {
          frequencies[value] = (frequencies[value] || 0) + 1;
        }
      });
    });

    // Paso 2: Ordenar por frecuencia descendente
    const sortedFreq = Object.entries(frequencies)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Paso 3: Calcular porcentajes acumulados
    const total = sortedFreq.reduce((sum, item) => sum + item.count, 0);
    let accumPercentage = 0;

    const paretoData = sortedFreq.map(item => {
      accumPercentage += (item.count / total) * 100;
      return {
        name: item.name,
        count: item.count,
        percentage: accumPercentage
      };
    });

    setParetoData(paretoData);
  };

  if (!data || !columns || columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-4">
          No hay datos disponibles para generar el diagrama de Pareto
        </p>
        <Link to="/upload" className="text-blue-600 hover:text-blue-700">
          Ir a cargar datos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Diagrama de Pareto</h2>
        
        {/* Información sobre el diagrama */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">¿Qué es un Diagrama de Pareto?</h3>
          <p className="text-blue-800">
            El Diagrama de Pareto es una herramienta que ayuda a identificar el 20% de las causas 
            que generan el 80% de los problemas (Principio de Pareto).
          </p>
        </div>

        {/* Gráfico */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Porcentaje Acumulado', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="count" 
                fill="#3b82f6" 
                name="Frecuencia"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="percentage" 
                stroke="#ef4444" 
                name="% Acumulado"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de datos */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frecuencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Acumulado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paretoData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.percentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParetoChart;