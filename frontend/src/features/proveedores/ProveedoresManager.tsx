import { Proveedor } from '@/types';

interface SupplierManagerProps {
  proveedores: Proveedor[];
}

export default function SupplierManager({ proveedores }: SupplierManagerProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Gestión de Proveedores</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Calificación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {proveedor.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {proveedor.contactoPrincipal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {proveedor.telefono}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">{proveedor.calificacion}/5</span>
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div
                        className="h-full bg-primary rounded"
                        style={{
                          width: `${(proveedor.calificacion / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button className="text-primary hover:text-secondary">
                    Editar
                  </button>
                  <button className="text-danger hover:text-red-700">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
