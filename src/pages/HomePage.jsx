import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, BarChart2, FileSpreadsheet, GitCommit, Settings, FileText } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <GitCommit className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">SigmaSuite</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/upload" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Análisis Six Sigma Con SigmaSuite
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Optimiza tus procesos y reduce defectos con nuestra plataforma integral de análisis Six Sigma
            </p>
            <div className="mt-10">
              <Link
                to="/upload"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Comenzar Análisis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <BarChart2 className="h-6 w-6 text-blue-500" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Dashboard KPIs</h3>
            </div>
            <p className="mt-4 text-gray-500">
              Visualiza métricas clave de rendimiento y sigue el progreso de tus procesos en tiempo real.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-blue-500" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Análisis Estadístico</h3>
            </div>
            <p className="mt-4 text-gray-500">
              Realiza análisis detallados con herramientas estadísticas avanzadas y visualizaciones claras.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-blue-500" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Herramientas LSS</h3>
            </div>
            <p className="mt-4 text-gray-500">
              Accede a las 7 herramientas principales de Lean Six Sigma para optimizar tus procesos.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <FileSpreadsheet className="h-6 w-6 text-blue-500" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Importación Flexible</h3>
            </div>
            <p className="mt-4 text-gray-500">
              Importa datos desde Excel o CSV y selecciona las columnas relevantes para tu análisis.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-500" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Reportes Detallados</h3>
            </div>
            <p className="mt-4 text-gray-500">
              Genera reportes profesionales con insights detallados y recomendaciones de mejora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;