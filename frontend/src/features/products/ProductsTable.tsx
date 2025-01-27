// src/features/productos/ProductTable.tsx
import { useState } from 'react';
import { Producto, Marca, Proveedor } from '../../types';
import ProductModal from './ProductModal';

interface ProductTableProps {
  productos: Producto[];
  marcas: Marca[];
  proveedores: Proveedor[];
}

export default function ProductTable({
  productos,
  marcas,
  proveedores,
}: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (producto: Producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestión de Productos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
        >
          Nuevo Producto
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Marca
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {producto.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {producto.marca.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${producto.precio.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap ${
                    producto.stock < producto.stockMinimo
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  {producto.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {producto.proveedor?.nombre || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(producto)}
                    className="text-primary hover:text-secondary"
                  >
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

      <ProductModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        marcas={marcas}
        proveedores={proveedores}
      />
    </div>
  );
}
