// src/components/layout/Layout.jsx
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileSpreadsheet, BarChart2, Settings, LineChart, FileText } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/upload',
      icon: <FileSpreadsheet size={20} />,
      title: 'Cargar Datos',
      description: 'Importar archivos CSV/Excel'
    },
    { 
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      title: 'Dashboard',
      description: 'Panel de control y KPIs'
    },
    { 
      path: '/statistics',
      icon: <BarChart2 size={20} />,
      title: 'Estadísticas',
      description: 'Análisis estadístico'
    },
    { 
      path: '/lss-tools',
      icon: <Settings size={20} />,
      title: 'Herramientas LSS',
      description: 'Pareto, Ishikawa, etc.'
    },
    { 
      path: '/SixSigmaCalculator',
      icon: <LineChart size={20} />,
      title: 'Calculadora Sigma',
      description: 'Cálculos Six Sigma'
    },
    { 
      path: '/reports',
      icon: <FileText size={20} />,
      title: 'Reportes',
      description: 'Generación de informes'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <div className="p-4">
          <Link to="/" className="flex items-center space-x-2 mb-6">
            <Settings className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">SigmaSuite</span>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;