// src/pages/LSSTools.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, 
  GitBranch, 
  LineChart, 
  ScatterChart, 
  CheckSquare, 
  List,
  FileSpreadsheet
} from 'lucide-react';

const LSSTools = () => {
  const tools = [
    {
      id: 'pareto',
      name: 'Diagrama de Pareto',
      description: 'Identifica las causas principales de los problemas',
      icon: <BarChart2 className="w-8 h-8 text-blue-500" />,
      path: '/lss-tools/pareto'
    },
    {
      id: 'ishikawa',
      name: 'Diagrama de Ishikawa',
      description: 'Análisis de causa y efecto (espina de pescado)',
      icon: <GitBranch className="w-8 h-8 text-blue-500" />,
      path: '/lss-tools/ishikawa'
    },
    {
      id: 'control-charts',
      name: 'Gráficos de Control',
      description: 'Monitoreo y control del proceso',
      icon: <LineChart className="w-8 h-8 text-blue-500" />,
      path: '/lss-tools/control-charts'
    },
    {
      id: 'scatter',
      name: 'Diagrama de Dispersión',
      description: 'Análisis de correlación entre variables',
      icon: <ScatterChart className="w-8 h-8 text-blue-500" />,
      path: '/lss-tools/scatter'
    },
    {
      id: 'check-sheet',
      name: 'Hojas de Verificación',
      description: 'Recolección y organización de datos',
      icon: <CheckSquare className="w-8 h-8 text-blue-500" />,
      path: '/lss-tools/check-sheet'
    },
    {
      id: 'stratification',
      name: 'Estratificación',
      description: 'Análisis por categorías o grupos',
      icon: <List className="w-8 h-8 text-blue-500" />,
      path: '/lss-tools/stratification'
    },
    {
      id: 'histogram',
      name: 'Histograma',
      description: 'Distribución y frecuencia de datos',
      icon: <FileSpreadsheet className="w-8 h-8 text-blue-500" />,
      path: '/lss-tools/histogram'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Herramientas Lean Six Sigma
        </h1>
        <p className="mt-2 text-gray-600">
          Las 7 herramientas básicas de calidad para el análisis y mejora de procesos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
          >
            <div className="flex items-start space-x-4">
              {tool.icon}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {tool.name}
                </h3>
                <p className="mt-1 text-gray-600">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          ¿Por qué usar estas herramientas?
        </h2>
        <p className="text-blue-800">
          Las 7 herramientas básicas de calidad son técnicas gráficas esenciales para:
        </p>
        <ul className="mt-2 space-y-2 text-blue-800">
          <li className="flex items-center">
            <span className="mr-2">•</span>
            Identificar y analizar problemas en procesos
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            Tomar decisiones basadas en datos
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            Mejorar la calidad y eficiencia
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            Reducir variabilidad y defectos
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LSSTools;