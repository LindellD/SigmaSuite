// src/components/lss-tools/Histogram.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Histogram = ({ data, columns }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [histogramData, setHistogramData] = useState([]);
  const [stats, setStats] = useState(null);
  const [binCount, setBinCount] = useState(10); // Número predeterminado de intervalos

  useEffect(() => {
    if (selectedColumn && data) {
      generateHistogram();
    }
  }, [selectedColumn, data, binCount]);

  const calculateStats = (values) => {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const sortedValues = [...values].sort((a, b) => a - b);
    
    return {
      n,
      mean,
      stdDev,
      min: sortedValues[0],
      max: sortedValues[n - 1],
      median: n % 2 === 0 
        ? (sortedValues[n/2 - 1] + sortedValues[n/2]) / 2
        : sortedValues[Math.floor(n/2)]
    };
  };

  const generateHistogram = () => {
    const values = data
      .map(row => parseFloat(row[selectedColumn]))
      .filter(val => !isNaN(val));

    if (values.length === 0) return;

    const stats = calculateStats(values);
    setStats(stats);

    // Calcular los intervalos
    const binWidth = (stats.max - stats.min) / binCount;
    const bins = Array(binCount).fill(0);
    const binRanges = [];

    // Crear los rangos de los intervalos
    for (let i = 0; i < binCount; i++) {
      const start = stats.min + (i * binWidth);
      const end = start + binWidth;
      binRanges.push({ start, end });
    }

    // Contar valores en cada intervalo
    values.forEach(value => {
      const binIndex = Math.min(
        Math.floor((value - stats.min) / binWidth),
        binCount - 1
      );
      bins[binIndex]++;
    });

    // Crear datos para el gráfico
    const histData = bins.map((count, i) => ({
      range: `${binRanges[i].start.toFixed(2)} - ${binRanges[i].end.toFixed(2)}`,
      frequency: count,
      normalDistribution: 
        (1 / (stats.stdDev * Math.sqrt(2 * Math.PI))) * 
        Math.exp(-Math.pow((binRanges[i].start + binWidth/2 - stats.mean), 2) / (2 * stats.stdDev * stats.stdDev)) * 
        values.length * binWidth
    }));

    setHistogramData(histData);
  };

  if (!data || !columns || columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-4">
          No hay datos disponibles para generar el histograma
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Histograma</h2>

        {/* Controles */}
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
              Número de intervalos
            </label>
            <input
              type="number"
              min="5"
              max="20"
              value={binCount}
              onChange={(e) => setBinCount(parseInt(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Histograma */}
        {histogramData.length > 0 && (
          <>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={histogramData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="range" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="frequency" 
                    fill="#3b82f6" 
                    name="Frecuencia"
                  />
                  <Line
                    type="monotone"
                    dataKey="normalDistribution"
                    stroke="#ef4444"
                    name="Distribución Normal"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Estadísticas */}
            {stats && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">N</p>
                  <p className="text-lg font-semibold">{stats.n}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Media</p>
                  <p className="text-lg font-semibold">{stats.mean.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Desv. Est.</p>
                  <p className="text-lg font-semibold">{stats.stdDev.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Mediana</p>
                  <p className="text-lg font-semibold">{stats.median.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Mínimo</p>
                  <p className="text-lg font-semibold">{stats.min.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Máximo</p>
                  <p className="text-lg font-semibold">{stats.max.toFixed(2)}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Información sobre histogramas */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">¿Qué es un Histograma?</h3>
        <p className="text-gray-700 mb-4">
          El histograma es una herramienta gráfica que muestra la distribución de frecuencia de un conjunto de datos.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Visualiza la forma de la distribución de los datos</li>
          <li>Identifica patrones, tendencias y anomalías</li>
          <li>Compara la distribución con una curva normal</li>
          <li>Ayuda a entender la variabilidad del proceso</li>
        </ul>
      </div>
    </div>
  );
};

export default Histogram;