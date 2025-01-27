// types/prisma.ts

// Enum de roles de usuario
export enum RolUsuario {
  ADMINISTRADOR = 'ADMINISTRADOR',
  GERENTE = 'GERENTE',
  CAJERO = 'CAJERO',
  PROVEEDOR = 'PROVEEDOR',
}

// Representación de la entidad Usuario
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  contraseña: string;
  rol: RolUsuario;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  cierresCaja: CierreCaja[];
  ventas: Venta[];
  registrosAuditoria: RegistroAuditoria[];
}

// Representación de la entidad Proveedor
export interface Proveedor {
  id: number;
  nombre: string;
  contactoPrincipal: string;
  telefono: string;
  correo: string;
  direccion?: string;
  calificacion: number;
  sitioWeb?: string;
  ingresosStock: IngresoStock[];
  productos: Producto[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Representación de la entidad Marca
export interface Marca {
  id: number;
  nombre: string;
  descripcion?: string;
  logoUrl?: string;
  productos: Producto[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Representación de la entidad Producto
export interface Producto {
  id: number;
  nombre: string;
  sku: string;
  descripcion?: string;
  marcaId: number;
  precio: number; // Precio como number, Prisma lo maneja como Decimal internamente
  costo: number; // Costo como number
  stock: number;
  stockMinimo: number;
  codigoBarras?: string;
  fechaExpiracion?: Date;
  proveedorId?: number;
  ingresosStock: IngresoStock[];
  detallesVenta: DetalleVenta[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Representación de la entidad Venta
export interface Venta {
  id: number;
  subtotal: number; // Subtotal como number
  total: number; // Total como number
  metodoPago: string;
  detallesPago?: Record<string, any>;
  usuarioId: number;
  usuario: Usuario;
  detalles: DetalleVenta[];
  cierreCajaId?: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Representación de la entidad DetalleVenta
export interface DetalleVenta {
  id: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number; // Precio unitario como number
  descuento: number; // Descuento como number
  fechaCreacion: Date;
}

// Representación de la entidad CierreCaja
export interface CierreCaja {
  id: number;
  fechaApertura: Date;
  fechaCierre?: Date;
  montoInicial: number; // Monto inicial como number
  montoFinal: number; // Monto final como number
  diferencia: number; // Diferencia como number
  usuarioId: number;
  usuario: Usuario;
  ventas: Venta[];
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Representación de la entidad IngresoStock
export interface IngresoStock {
  id: number;
  proveedorId: number;
  proveedor: Proveedor;
  productoId: number;
  producto: Producto;
  cantidad: number;
  costoUnitario: number; // Costo unitario como number
  costoTotal: number; // Costo total como number
  fechaIngreso: Date;
  fechaExpiracion?: Date;
  numeroFactura?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Representación de la entidad RegistroAuditoria
export interface RegistroAuditoria {
  id: number;
  tipoAccion: string;
  entidad: string;
  entidadId?: number;
  usuarioId: number;
  usuario: Usuario;
  detalles?: Record<string, any>;
  direccionIP?: string;
  agenteUsuario?: string;
  fechaCreacion: Date;
}
