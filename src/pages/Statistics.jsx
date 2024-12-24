// src/pages/Statistics.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';

const Statistics = ({ data, columns }) => {
  if (!data || !columns || columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-4">
          No hay datos disponibles para el análisis estadístico
        </p>
        <Link to="/upload" className="text-blue-600 hover:text-blue-700">
          Ir a cargar datos
        </Link>
      </div>
    );
  }

  const calculateStats = (columnName) => {
    const values = data.map(row => parseFloat(row[columnName])).filter(val => !isNaN(val));
    if (values.length === 0) return null;

    const sortedValues = [...values].sort((a, b) => a - b);
    const n = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    // Crear datos para el histograma
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const binCount = 10;
    const binWidth = range / binCount;
    
    const histogramData = Array(binCount).fill(0).map((_, i) => {
      const binStart = min + (i * binWidth);
      const binEnd = binStart + binWidth;
      const count = values.filter(v => v >= binStart && v < binEnd).length;
      return {
        bin: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
        count: count
      };
    });

    return {
      n,
      mean: mean.toFixed(2),
      stdDev: stdDev.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      histogramData
    };
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Análisis Estadístico</h1>

      {columns.map(column => {
        const stats = calculateStats(column);
        if (!stats) return null;

        return (
          <div key={column} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{column}</h2>
            
            {/* Estadísticas básicas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">N</p>
                <p className="text-lg font-medium">{stats.n}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Media</p>
                <p className="text-lg font-medium">{stats.mean}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Desv. Est.</p>
                <p className="text-lg font-medium">{stats.stdDev}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Mínimo</p>
                <p className="text-lg font-medium">{stats.min}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Máximo</p>
                <p className="text-lg font-medium">{stats.max}</p>
              </div>
            </div>

            {/* Histograma */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Distribución de Datos</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.histogramData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bin" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;