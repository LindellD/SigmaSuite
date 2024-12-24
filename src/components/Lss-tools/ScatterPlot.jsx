// src/components/lss-tools/ScatterPlot.jsx
import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ScatterPlot = ({ data, columns }) => {
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [correlation, setCorrelation] = useState(null);
  const [scatterData, setScatterData] = useState([]);

  useEffect(() => {
    if (xColumn && yColumn && data) {
      processData();
    }
  }, [xColumn, yColumn, data]);

  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);

    const r = (n * sumXY - sumX * sumY) / 
              Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    return r;
  };

  const processData = () => {
    const validData = data
      .map(row => ({
        x: parseFloat(row[xColumn]),
        y: parseFloat(row[yColumn])
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y));

    setScatterData(validData);

    // Calcular correlación
    const xValues = validData.map(point => point.x);
    const yValues = validData.map(point => point.y);
    const r = calculateCorrelation(xValues, yValues);
    setCorrelation(r);
  };

  if (!data || !columns || columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-4">
          No hay datos disponibles para generar el diagrama de dispersión
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Diagrama de Dispersión</h2>

        {/* Selectores de variables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variable X (independiente)
            </label>
            <select
              value={xColumn}
              onChange={(e) => setXColumn(e.target.value)}
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
              Variable Y (dependiente)
            </label>
            <select
              value={yColumn}
              onChange={(e) => setYColumn(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Seleccione una variable</option>
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gráfico de dispersión */}
        {xColumn && yColumn && scatterData.length > 0 && (
          <>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    type="number" 
                    name={xColumn}
                  >
                    <Label value={xColumn} position="bottom" offset={0} />
                  </XAxis>
                  <YAxis 
                    dataKey="y" 
                    type="number" 
                    name={yColumn}
                  >
                    <Label value={yColumn} angle={-90} position="left" offset={0} />
                  </YAxis>
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value) => value.toFixed(2)}
                  />
                  <Scatter 
                    data={scatterData} 
                    fill="#3b82f6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Información de correlación */}
            {correlation !== null && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Análisis de Correlación</h3>
                <p className="text-gray-700">
                  Coeficiente de correlación (r): <span className="font-bold">{correlation.toFixed(4)}</span>
                </p>
                <p className="text-gray-600 mt-2">
                  Interpretación: 
                  {correlation > 0.7 && " Correlación positiva fuerte"}
                  {correlation > 0.3 && correlation <= 0.7 && " Correlación positiva moderada"}
                  {correlation >= -0.3 && correlation <= 0.3 && " Correlación débil o nula"}
                  {correlation < -0.3 && correlation >= -0.7 && " Correlación negativa moderada"}
                  {correlation < -0.7 && " Correlación negativa fuerte"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Información sobre el diagrama de dispersión */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">¿Qué es un Diagrama de Dispersión?</h3>
        <p className="text-gray-700 mb-4">
          El diagrama de dispersión es una herramienta que permite visualizar la relación entre dos variables cuantitativas.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Ayuda a identificar correlaciones entre variables</li>
          <li>Permite detectar patrones y tendencias</li>
          <li>Útil para análisis de causa y efecto</li>
          <li>Facilita la toma de decisiones basada en datos</li>
        </ul>
      </div>
    </div>
  );
};

export default ScatterPlot;