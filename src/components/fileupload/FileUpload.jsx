import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Upload, FileText, Check } from 'lucide-react';

const FileUpload = ({ onDataLoad }) => {
  const [dragActive, setDragActive] = useState(false);
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const processFile = useCallback((file) => {
    setError('');
    if (!file) return;

    setFileName(file.name);
    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const cols = Object.keys(results.data[0]);
            setColumns(cols);
            setData(results.data);
          }
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          setError('Error al procesar el archivo CSV');
          console.error(error);
        }
      });
    } else if (['xlsx', 'xls'].includes(fileType)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(firstSheet);
          const cols = Object.keys(data[0]);
          setColumns(cols);
          setData(data);
        } catch (error) {
          setError('Error al procesar el archivo Excel');
          console.error(error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleColumnSelect = (column) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const handleSubmit = () => {
    if (selectedColumns.length === 0) {
      setError('Por favor, seleccione al menos una columna');
      return;
    }
    
    const filteredData = data.map(row =>
      selectedColumns.reduce((obj, col) => {
        obj[col] = row[col];
        return obj;
      }, {})
    );

    onDataLoad(filteredData, selectedColumns);
  };

  return (
    <div className="space-y-6">
      {/* Zona de carga de archivos */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
          id="file-upload"
        />
        
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <span className="text-lg font-medium text-gray-700">
            {fileName ? `Archivo cargado: ${fileName}` : 'Arrastra un archivo o haz clic para seleccionar'}
          </span>
          <span className="text-sm text-gray-500 mt-2">
            Soporta archivos CSV y Excel
          </span>
        </label>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* Selección de columnas */}
      {columns.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Seleccionar columnas para análisis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {columns.map((column) => (
              <label
                key={column}
                className={`flex items-center gap-2 p-3 rounded border cursor-pointer hover:bg-gray-50 ${
                  selectedColumns.includes(column)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column)}
                  onChange={() => handleColumnSelect(column)}
                  className="hidden"
                />
                <span className={selectedColumns.includes(column) ? 'text-blue-700' : 'text-gray-700'}>
                  {column}
                </span>
                {selectedColumns.includes(column) && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Botón de proceso */}
      {selectedColumns.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" />
            Procesar datos
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;