// src/components/lss-tools/CheckSheet.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, FileInput } from 'lucide-react';

const CheckSheet = () => {
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [checkData, setCheckData] = useState({});
    const [dates, setDates] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [savedSheets, setSavedSheets] = useState(() => {
      const saved = localStorage.getItem('checkSheets');
      return saved ? JSON.parse(saved) : [];
    });

  useEffect(() => {
    // Establecer la fecha actual como valor inicial
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
  }, []);

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setCheckData(prev => ({
        ...prev,
        [newCategory.trim()]: {}
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category) => {
    setCategories(categories.filter(c => c !== category));
    const newData = { ...checkData };
    delete newData[category];
    setCheckData(newData);
  };

  const addDate = () => {
    if (currentDate && !dates.includes(currentDate)) {
      setDates([...dates, currentDate].sort());
      categories.forEach(category => {
        setCheckData(prev => ({
          ...prev,
          [category]: {
            ...prev[category],
            [currentDate]: prev[category]?.[currentDate] || 0
          }
        }));
      });
    }
  };

  const updateCount = (category, date, increment) => {
    setCheckData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [date]: Math.max(0, (prev[category]?.[date] || 0) + increment)
      }
    }));
  };

  const calculateTotal = (category) => {
    return dates.reduce((sum, date) => sum + (checkData[category]?.[date] || 0), 0);
  };

   // Función de guardado
   const saveCheckSheet = () => {
    if (!title.trim()) {
      alert('Por favor, ingrese un título para la hoja de verificación');
      return;
    }

    try {
      const newSheet = {
        id: Date.now(),
        title,
        categories,
        dates,
        checkData,
        createdAt: new Date().toISOString()
      };

      const updatedSheets = [...savedSheets, newSheet];
      setSavedSheets(updatedSheets);
      localStorage.setItem('checkSheets', JSON.stringify(updatedSheets));
      
      console.log('Hoja guardada:', newSheet); // Para debugging
      alert('Hoja de verificación guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la hoja de verificación');
    }
  };

  // Función de carga
  const loadLastSheet = () => {
    try {
      const sheets = localStorage.getItem('checkSheets');
      if (sheets) {
        const parsedSheets = JSON.parse(sheets);
        if (parsedSheets.length > 0) {
          const lastSheet = parsedSheets[parsedSheets.length - 1];
          setTitle(lastSheet.title);
          setCategories(lastSheet.categories);
          setDates(lastSheet.dates);
          setCheckData(lastSheet.checkData);
          alert('Hoja de verificación cargada exitosamente');
        } else {
          alert('No hay hojas de verificación guardadas');
        }
      }
    } catch (error) {
      console.error('Error al cargar:', error);
      alert('Error al cargar la hoja de verificación');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la Hoja de Verificación
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Ej: Control de Defectos de Producción"
          />
        </div>

        {/* Agregar categorías */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Nueva categoría"
            />
            <button
              onClick={addCategory}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Agregar fecha */}
        <div className="mb-6 flex gap-2">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <button
            onClick={addDate}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Agregar Fecha
          </button>
        </div>

        {/* Tabla de verificación */}
        {categories.length > 0 && dates.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  {dates.map(date => (
                    <th key={date} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {date}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => (
                  <tr key={category}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category}
                    </td>
                    {dates.map(date => (
                      <td key={date} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCount(category, date, -1)}
                            className="text-red-500 hover:text-red-700"
                          >
                            -
                          </button>
                          <span>{checkData[category]?.[date] || 0}</span>
                          <button
                            onClick={() => updateCount(category, date, 1)}
                            className="text-green-500 hover:text-green-700"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {calculateTotal(category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => removeCategory(category)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-4">
  <button
    onClick={() => {
      const sheets = JSON.parse(localStorage.getItem('checkSheets') || '[]');
      if (sheets.length > 0) {
        const lastSheet = sheets[sheets.length - 1];
        setTitle(lastSheet.title);
        setCategories(lastSheet.categories);
        setDates(lastSheet.dates);
        setCheckData(lastSheet.checkData);
      } else {
        alert('No hay hojas de verificación guardadas');
      }
    }}
    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
  >
    <FileInput size={20} />
    Cargar última hoja
  </button>
  <button
    onClick={saveCheckSheet}
    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
  >
    <Save size={20} />
    Guardar
  </button>
</div>
      </div>

      {/* Información sobre hojas de verificación */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">¿Qué son las Hojas de Verificación?</h3>
        <p className="text-gray-700 mb-4">
          Las hojas de verificación son herramientas de recolección y análisis de datos que permiten:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Registrar datos de manera sistemática y organizada</li>
          <li>Facilitar la recopilación de información en tiempo real</li>
          <li>Visualizar tendencias y patrones</li>
          <li>Tomar decisiones basadas en datos concretos</li>
        </ul>
      </div>
    </div>
  );
};

export default CheckSheet;