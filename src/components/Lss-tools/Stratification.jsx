// src/components/lss-tools/Stratification.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Stratification = ({ data, columns }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [stratifyBy, setStratifyBy] = useState('');
  const [stratifiedData, setStratifiedData] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    if (selectedColumn && stratifyBy && data) {
      stratifyData();
    }
  }, [selectedColumn, stratifyBy, data]);

  const stratifyData = () => {
    // Agrupar datos por la columna de estratificación
    const groups = {};
    const summaryData = {};

    data.forEach(row => {
      const stratValue = row[stratifyBy];
      const value = parseFloat(row[selectedColumn]);

      if (!isNaN(value)) {
        if (!groups[stratValue]) {
          groups[stratValue] = [];
          summaryData[stratValue] = {
            count: 0,
            sum: 0,
            min: Infinity,
            max: -Infinity
          };
        }
        
        groups[stratValue].push(value);
        summaryData[stratValue].count++;
        summaryData[stratValue].sum += value;
        summaryData[stratValue].min = Math.min(summaryData[stratValue].min, value);
        summaryData[stratValue].max = Math.max(summaryData[stratValue].max, value);
      }
    });

    // Calcular estadísticas para cada grupo
    const chartData = Object.keys(groups).map(key => {
      const values = groups[key];
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      
      return {
        name: key,
        promedio: avg,
        min: summaryData[key].min,
        max: summaryData[key].max,
        count: summaryData[key].count
      };
    });

    setStratifiedData(chartData);
    setSummary(Object.entries(summaryData).map(([key, stats]) => ({
      grupo: key,
      count: stats.count,
      promedio: (stats.sum / stats.count).toFixed(2),
      min: stats.min,
      max: stats.max
    })));
  };

  if (!data || !columns || columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-4">
          No hay datos disponibles para realizar la estratificación
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Análisis de Estratificación</h2>

        {/* Selectores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variable a analizar
            </label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Seleccione una variable</option>
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estratificar por
            </label>
            <select
              value={stratifyBy}
              onChange={(e) => setStratifyBy(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Seleccione una variable</option>
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gráfico de estratificación */}
        {stratifiedData.length > 0 && (
          <>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stratifiedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="promedio" fill="#3b82f6" name="Promedio" />
                  <Bar dataKey="min" fill="#34d399" name="Mínimo" />
                  <Bar dataKey="max" fill="#f87171" name="Máximo" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla de resumen */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Grupo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Promedio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mínimo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Máximo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.grupo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.promedio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.min}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.max}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Información sobre estratificación */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">¿Qué es la Estratificación?</h3>
        <p className="text-gray-700 mb-4">
          La estratificación es una técnica que divide los datos en grupos o categorías para identificar patrones y diferencias entre ellos.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Ayuda a identificar las fuentes de variación</li>
          <li>Permite comparar el comportamiento entre diferentes grupos</li>
          <li>Facilita la identificación de áreas de mejora</li>
          <li>Es útil para el análisis de causa raíz</li>
        </ul>
      </div>
    </div>
  );
};

export default Stratification;