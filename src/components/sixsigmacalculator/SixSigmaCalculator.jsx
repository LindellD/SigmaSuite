
import React, { useState } from 'react';
import { Calculator, AlertCircle, Info } from 'lucide-react';

const SixSigmaCalculator = () => {
  const [calculatorType, setCalculatorType] = useState('dpmo');
  const [inputs, setInputs] = useState({
    defects: '',
    opportunities: '',
    units: '',
    dpmo: '',
    sigmaLevel: '',
    yield: ''
  });

  const calculateDPMO = () => {
    const defects = parseFloat(inputs.defects);
    const opportunities = parseFloat(inputs.opportunities);
    const units = parseFloat(inputs.units);

    if (!defects || !opportunities || !units) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    const dpmo = (defects / (opportunities * units)) * 1000000;
    const yield_value = (1 - (defects / (opportunities * units))) * 100;
    const sigmaLevel = 0.8406 + Math.sqrt(29.37 - 2.221 * Math.log(dpmo));

    setInputs({
      ...inputs,
      dpmo: dpmo.toFixed(2),
      sigmaLevel: sigmaLevel.toFixed(2),
      yield: yield_value.toFixed(2)
    });
  };

  const calculateFromSigma = () => {
    const sigmaLevel = parseFloat(inputs.sigmaLevel);

    if (!sigmaLevel) {
      alert('Por favor, ingrese el nivel sigma');
      return;
    }

    // Fórmula inversa para DPMO desde nivel sigma
    const dpmo = Math.exp((29.37 - Math.pow(sigmaLevel - 0.8406, 2)) / 2.221);
    const yield_value = (1 - (dpmo / 1000000)) * 100;

    setInputs({
      ...inputs,
      dpmo: dpmo.toFixed(2),
      yield: yield_value.toFixed(2)
    });
  };

  const calculateFromYield = () => {
    const yield_value = parseFloat(inputs.yield);

    if (!yield_value) {
      alert('Por favor, ingrese el yield');
      return;
    }

    const dpmo = (1 - (yield_value / 100)) * 1000000;
    const sigmaLevel = 0.8406 + Math.sqrt(29.37 - 2.221 * Math.log(dpmo));

    setInputs({
      ...inputs,
      dpmo: dpmo.toFixed(2),
      sigmaLevel: sigmaLevel.toFixed(2)
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Calculadora Six Sigma
        </h2>

        {/* Selector de tipo de cálculo */}
        <div className="mb-6">
          <select
            value={calculatorType}
            onChange={(e) => setCalculatorType(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="dpmo">Calcular desde Defectos (DPMO)</option>
            <option value="sigma">Calcular desde Nivel Sigma</option>
            <option value="yield">Calcular desde Yield</option>
          </select>
        </div>

        {/* Campos de entrada según el tipo seleccionado */}
        {calculatorType === 'dpmo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de defectos
              </label>
              <input
                type="number"
                value={inputs.defects}
                onChange={(e) => setInputs({ ...inputs, defects: e.target.value })}
                className="w-full p-2 border rounded-lg"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oportunidades por unidad
              </label>
              <input
                type="number"
                value={inputs.opportunities}
                onChange={(e) => setInputs({ ...inputs, opportunities: e.target.value })}
                className="w-full p-2 border rounded-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidades totales
              </label>
              <input
                type="number"
                value={inputs.units}
                onChange={(e) => setInputs({ ...inputs, units: e.target.value })}
                className="w-full p-2 border rounded-lg"
                min="1"
              />
            </div>
            <button
              onClick={calculateDPMO}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Calcular
            </button>
          </div>
        )}

        {calculatorType === 'sigma' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel Sigma
              </label>
              <input
                type="number"
                value={inputs.sigmaLevel}
                onChange={(e) => setInputs({ ...inputs, sigmaLevel: e.target.value })}
                className="w-full p-2 border rounded-lg"
                min="0"
                step="0.01"
              />
            </div>
            <button
              onClick={calculateFromSigma}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Calcular
            </button>
          </div>
        )}

        {calculatorType === 'yield' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yield (%)
              </label>
              <input
                type="number"
                value={inputs.yield}
                onChange={(e) => setInputs({ ...inputs, yield: e.target.value })}
                className="w-full p-2 border rounded-lg"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <button
              onClick={calculateFromYield}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Calcular
            </button>
          </div>
        )}

        {/* Resultados */}
        {(inputs.dpmo || inputs.sigmaLevel || inputs.yield) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">DPMO</p>
              <p className="text-lg font-semibold">{inputs.dpmo}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Nivel Sigma</p>
              <p className="text-lg font-semibold">{inputs.sigmaLevel}σ</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Yield</p>
              <p className="text-lg font-semibold">{inputs.yield}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Información sobre las métricas */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Info className="h-5 w-5" />
          Información sobre las métricas
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">DPMO (Defectos Por Millón de Oportunidades)</h4>
            <p className="text-gray-600">
              Indica cuántos defectos ocurrirían si hubiera un millón de oportunidades para que ocurran.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Nivel Sigma</h4>
            <p className="text-gray-600">
              Medida de la variación del proceso. Un nivel sigma más alto indica un mejor rendimiento.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Yield (Rendimiento)</h4>
            <p className="text-gray-600">
              Porcentaje de unidades sin defectos en relación con el total de unidades procesadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SixSigmaCalculator;