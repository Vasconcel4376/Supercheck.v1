import { useState } from 'react';
import { CierreCaja } from '@/types';

interface CashControlProps {
  cierreActual?: CierreCaja;
}

export default function CashControl({ cierreActual }: CashControlProps) {
  const [montoInicial, setMontoInicial] = useState('');

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Control de Caja</h2>

      {!cierreActual ? (
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Monto inicial en caja"
            value={montoInicial}
            onChange={(e) => setMontoInicial(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button className="w-full bg-primary text-white py-2 rounded hover:bg-secondary">
            Iniciar Turno
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm text-gray-500">Monto Inicial</h3>
              <p className="text-xl font-semibold">
                ${cierreActual.montoInicial.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm text-gray-500">Ventas Totales</h3>
              <p className="text-xl font-semibold">
                $
                {(cierreActual.montoFinal - cierreActual.montoInicial).toFixed(
                  2
                )}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm text-gray-500">Diferencia</h3>
              <p
                className={`text-xl font-semibold ${
                  cierreActual.diferencia !== 0 ? 'text-danger' : 'text-success'
                }`}
              >
                ${cierreActual.diferencia.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <button className="w-full bg-danger text-white py-2 rounded hover:bg-red-600">
              Cerrar Caja
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
