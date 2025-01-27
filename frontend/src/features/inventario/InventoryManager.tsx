import { Producto } from '@/types';

interface InventoryManagerProps {
  productos: Producto[];
}

export default function InventoryManager({ productos }: InventoryManagerProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Control de Inventario</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((producto) => (
          <div key={producto.id} className="border p-4 rounded-lg">
            <h3 className="font-medium">{producto.nombre}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">SKU:</span>
                <p>{producto.sku}</p>
              </div>
              <div>
                <span className="text-gray-500">Stock Actual:</span>
                <p
                  className={
                    producto.stock < producto.stockMinimo ? 'text-red-500' : ''
                  }
                >
                  {producto.stock}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Mínimo:</span>
                <p>{producto.stockMinimo}</p>
              </div>
              <div>
                <span className="text-gray-500">Última Actualización:</span>
                <p>
                  {producto.fechaActualizacion
                    ? new Date(producto.fechaActualizacion).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
