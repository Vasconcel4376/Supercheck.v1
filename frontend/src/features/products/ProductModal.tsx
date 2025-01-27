import React, { useState, useEffect } from 'react';
import { Producto, Marca, Proveedor } from '@/types';

interface ProductModalProps {
  show: boolean;
  onClose: () => void;
  product: Producto | null;
  marcas: Marca[];
  proveedores: Proveedor[];
}

export default function ProductModal({
  show,
  onClose,
  product,
  marcas,
  proveedores,
}: ProductModalProps) {
  const [nombre, setNombre] = useState('');
  const [marcaId, setMarcaId] = useState<number | undefined>(undefined);
  const [proveedorId, setProveedorId] = useState<number | undefined>(undefined);
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (product) {
      setNombre(product.nombre);
      setMarcaId(product.marcaId);
      setProveedorId(product.proveedorId);
      setPrecio(product.precio);
      setStock(product.stock);
    } else {
      setNombre('');
      setMarcaId(undefined);
      setProveedorId(undefined);
      setPrecio(0);
      setStock(0);
    }
  }, [product]);

  if (!show) return null;

  const handleSave = () => {
    // Aquí tu lógica de guardar/actualizar
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              className="w-full border p-2 rounded"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <select
              className="w-full border p-2 rounded"
              value={marcaId ?? ''}
              onChange={(e) => setMarcaId(Number(e.target.value))}
            >
              <option value="">Seleccionar marca</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proveedor
            </label>
            <select
              className="w-full border p-2 rounded"
              value={proveedorId ?? ''}
              onChange={(e) => setProveedorId(Number(e.target.value))}
            >
              <option value="">Seleccionar proveedor</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
