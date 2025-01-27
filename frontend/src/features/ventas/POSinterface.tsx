// src/features/ventas/POSInterface.tsx
import { useState } from 'react'
import { Producto, DetalleVenta, MetodoPago } from '../../types'

interface POSInterfaceProps {
  productos: Producto[]
}

export default function POSInterface({ productos }: POSInterfaceProps) {
  const [cart, setCart] = useState<DetalleVenta[]>([])
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('EFECTIVO')
  const [searchTerm, setSearchTerm] = useState('')

  const addToCart = (producto: Producto) => {
    const existing = cart.find(item => item.producto.id === producto.id)
    if (existing) {
      setCart(cart.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        producto,
        cantidad: 1,
        precioUnitario: producto.precio,
        descuento: 0
      }])
    }
  }

  const total = cart.reduce((sum, item) => 
    sum + (item.cantidad * item.precioUnitario * (1 - item.descuento / 100)), 0
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel de Productos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Productos</h3>
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full mb-4 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {productos
            .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(producto => (
              <button
                key={producto.id}
                onClick={() => addToCart(producto)}
                className="border p-4 rounded hover:bg-gray-50 text-left"
              >
                <h4 className="font-medium">{producto.nombre}</h4>
                <p className="text-sm text-gray-600">${producto.precio.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Stock: {producto.stock}</p>
              </button>
            ))}
        </div>
      </div>

      {/* Carrito y Pago */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Carrito de Compra</h3>
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div className="flex-1">
                <h4 className="font-medium">{item.producto.nombre}</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => {
                      const newQty = Math.max(1, parseInt(e.target.value))
                      setCart(cart.map((cartItem, i) => 
                        i === index ? { ...cartItem, cantidad: newQty } : cartItem
                      ))
                    }}
                    className="w-16 p-1 border rounded"
                  />
                  <span>x ${item.precioUnitario.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => setCart(cart.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </select>

          <button
            className="w-full bg-success text-white py-3 rounded hover:bg-green-600"
            onClick={() => {/* Lógica de venta */}
          >
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  )
}