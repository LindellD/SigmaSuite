import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/fileupload/FileUpload';

const FileUploadPage = ({ onDataLoad }) => {
  const navigate = useNavigate();

  const handleDataLoad = (data, columns) => {
    console.log('FileUploadPage recibió datos:', data);
    onDataLoad(data, columns);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Cargar Datos para Análisis
      </h1>
      <FileUpload onDataLoad={handleDataLoad} />
    </div>
  );
};

export default FileUploadPage;