import React, { useState } from 'react';

const IshikawaDiagram = () => {
  const [effect, setEffect] = useState('');
  const [categories, setCategories] = useState([
    { id: 1, name: 'Mano de Obra', causes: [], color: 'bg-blue-100' },
    { id: 2, name: 'Métodos', causes: [], color: 'bg-green-100' },
    { id: 3, name: 'Materiales', causes: [], color: 'bg-yellow-100' },
    { id: 4, name: 'Maquinaria', causes: [], color: 'bg-purple-100' },
    { id: 5, name: 'Medición', causes: [], color: 'bg-pink-100' },
    { id: 6, name: 'Medio Ambiente', causes: [], color: 'bg-orange-100' }
  ]);

  const addCause = (categoryId, cause) => {
    if (cause.trim()) {
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, causes: [...cat.causes, cause] }
          : cat
      ));
    }
  };

  const removeCause = (categoryId, causeIndex) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, causes: cat.causes.filter((_, index) => index !== causeIndex) }
        : cat
    ));
  };

  return (
    <div className="p-6">
      {/* Entrada del efecto principal */}
      <div className="mb-8">
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="Efecto Principal"
          className="w-full p-3 border rounded-lg text-center text-xl font-semibold"
        />
      </div>

      {/* Diagrama de Ishikawa */}
      <div className="relative min-h-[600px]">
        {/* SVG para las líneas diagonales */}
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
          {/* Línea central */}
          <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#666" strokeWidth="2"/>
          
          {/* Líneas superiores diagonales */}
          <line x1="25%" y1="50%" x2="20%" y2="20%" stroke="#666" strokeWidth="2"/>
          <line x1="50%" y1="50%" x2="45%" y2="20%" stroke="#666" strokeWidth="2"/>
          <line x1="75%" y1="50%" x2="70%" y2="20%" stroke="#666" strokeWidth="2"/>

          {/* Líneas inferiores diagonales */}
          <line x1="25%" y1="50%" x2="20%" y2="80%" stroke="#666" strokeWidth="2"/>
          <line x1="50%" y1="50%" x2="45%" y2="80%" stroke="#666" strokeWidth="2"/>
          <line x1="75%" y1="50%" x2="70%" y2="80%" stroke="#666" strokeWidth="2"/>

          {/* Flecha al final */}
          <polygon points="90%,50% 88%,48% 88%,52%" fill="#666"/>
        </svg>

        {/* Efecto Principal */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-red-100 p-4 rounded-lg shadow">
            {effect || 'Efecto Principal'}
          </div>
        </div>

        {/* Categorías y causas */}
        <div className="relative z-10">
          {/* Categorías superiores */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {categories.slice(0, 3).map((category, index) => (
              <div key={category.id} className="mt-4" style={{ paddingLeft: `${25 + index * 25}%` }}>
                <div className={`${category.color} p-4 rounded-lg shadow`}>
                  <h3 className="font-bold mb-2">{category.name}</h3>
                  <input
                    type="text"
                    placeholder="Agregar causa"
                    className="w-full p-2 rounded border mb-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addCause(category.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="space-y-2">
                    {category.causes.map((cause, idx) => (
                      <div key={idx} className="bg-white p-2 rounded shadow text-sm group">
                        <div className="flex justify-between items-center">
                          <span>{cause}</span>
                          <button
                            onClick={() => removeCause(category.id, idx)}
                            className="text-red-500 opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Espacio para la línea central */}
          <div style={{ height: "100px" }}></div>

          {/* Categorías inferiores */}
          <div className="grid grid-cols-3 gap-4">
            {categories.slice(3).map((category, index) => (
              <div key={category.id} className="mt-4" style={{ paddingLeft: `${25 + index * 25}%` }}>
                <div className={`${category.color} p-4 rounded-lg shadow`}>
                  <h3 className="font-bold mb-2">{category.name}</h3>
                  <input
                    type="text"
                    placeholder="Agregar causa"
                    className="w-full p-2 rounded border mb-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addCause(category.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="space-y-2">
                    {category.causes.map((cause, idx) => (
                      <div key={idx} className="bg-white p-2 rounded shadow text-sm group">
                        <div className="flex justify-between items-center">
                          <span>{cause}</span>
                          <button
                            onClick={() => removeCause(category.id, idx)}
                            className="text-red-500 opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Instrucciones:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Ingresa el efecto o problema principal en el campo superior</li>
          <li>Para cada categoría, escribe una causa y presiona Enter para agregarla</li>
          <li>Pasa el mouse sobre una causa para mostrar la opción de eliminarla</li>
        </ol>
      </div>
    </div>
  );
};

export default IshikawaDiagram;