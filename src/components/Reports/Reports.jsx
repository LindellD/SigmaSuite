// src/components/Reports.jsx
import React, { useState } from 'react';
import { FileText, Download, ArrowRight, Printer, BarChart } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Reports = ({ data, columns }) => {
  const [selectedContent, setSelectedContent] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    analyst: '',
    objective: ''
  });

  const reportSections = [
    { id: 'pareto', name: 'Análisis de Pareto', icon: <BarChart className="w-5 h-5" /> },
    { id: 'ishikawa', name: 'Diagrama de Ishikawa', icon: <BarChart className="w-5 h-5" /> },
    { id: 'controlChart', name: 'Gráficos de Control', icon: <BarChart className="w-5 h-5" /> },
    { id: 'scatter', name: 'Diagrama de Dispersión', icon: <BarChart className="w-5 h-5" /> },
    { id: 'stratification', name: 'Análisis de Estratificación', icon: <BarChart className="w-5 h-5" /> },
    { id: 'histogram', name: 'Histograma', icon: <BarChart className="w-5 h-5" /> },
    { id: 'checkSheet', name: 'Hojas de Verificación', icon: <FileText className="w-5 h-5" /> }
  ];

  const toggleSection = (sectionId) => {
    setSelectedContent(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const generateReport = (format = 'pdf') => {
    if (!reportTitle.trim()) {
      alert('Por favor, ingrese un título para el reporte');
      return;
    }
    if (selectedContent.length === 0) {
      alert('Por favor, seleccione al menos una sección para el reporte');
      return;
    }

    const element = document.getElementById('report-preview');

    if (format === 'pdf') {
      const opt = {
        margin: 1,
        filename: `${reportTitle.trim()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    } else if (format === 'print') {
      window.print();
    }
};

const reportStyles = `
  @media print {
    body {
      padding: 20px;
    }
    .no-print {
      display: none;
    }
  }
`;
  return (
           
    <div className="p-6 space-y-6">
      {/* Formulario del Reporte */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Generación de Reportes
        </h2>

        {/* Información del Proyecto */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Información del Proyecto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Reporte
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Ej: Análisis de Mejora de Proceso"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                value={projectInfo.projectName}
                onChange={(e) => setProjectInfo({...projectInfo, projectName: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="Ej: Mejora del Proceso de Producción"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <input
                type="text"
                value={projectInfo.department}
                onChange={(e) => setProjectInfo({...projectInfo, department: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="Ej: Producción"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analista
              </label>
              <input
                type="text"
                value={projectInfo.analyst}
                onChange={(e) => setProjectInfo({...projectInfo, analyst: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="Nombre del analista"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo del Análisis
              </label>
              <textarea
                value={projectInfo.objective}
                onChange={(e) => setProjectInfo({...projectInfo, objective: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="Describe el objetivo principal del análisis..."
              />
            </div>
          </div>
        </div>

        {/* Selección de Contenido */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Contenido del Reporte</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportSections.map(section => (
              <div
                key={section.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedContent.includes(section.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span className="font-medium">{section.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
                onClick={() => generateReport('print')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
                <Printer className="w-5 h-5" />
                Vista Previa
            </button>
            <div className="relative">
                <button
                onClick={() => generateReport('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                <Download className="w-5 h-5" />
                Generar PDF
                </button>
            </div>
            </div>
        
      </div>

      {/* Vista Previa */}
      {selectedContent.length > 0 && (
        <div id="report-preview" className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h1 className="text-2xl font-bold">{reportTitle || 'Título del Reporte'}</h1>
              <p className="text-gray-600">{projectInfo.projectName}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <p><span className="font-medium">Departamento:</span> {projectInfo.department}</p>
                <p><span className="font-medium">Fecha:</span> {projectInfo.date}</p>
                <p><span className="font-medium">Analista:</span> {projectInfo.analyst}</p>
              </div>
            </div>
            
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Objetivo</h2>
              <p className="text-gray-700">{projectInfo.objective}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Análisis Realizados</h2>
              {selectedContent.map(contentId => {
                const section = reportSections.find(s => s.id === contentId);
                return (
                  <div key={contentId} className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                    <span>{section.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Reports;