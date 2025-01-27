// Enums correspondientes a Prisma
export enum RolUsuario {
  ADMINISTRADOR = 'ADMINISTRADOR',
  GERENTE = 'GERENTE',
  CAJERO = 'CAJERO',
  PROVEEDOR = 'PROVEEDOR',
}

export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  contraseña: string;
  rol: RolUsuario;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export type Proveedor = {
  id: number;
  nombre: string;
  contactoPrincipal: string;
  telefono: string;
  correo: string;
  direccion?: string;
  calificacion: number;
  sitioWeb?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export type Marca = {
  id: number;
  nombre: string;
  descripcion?: string;
  logoUrl?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export type Producto = {
  id: number;
  nombre: string;
  sku: string;
  descripcion?: string;
  marcaId: number;
  marca: Marca;
  precio: number;
  costo: number;
  stock: number;
  stockMinimo: number;
  codigoBarras?: string;
  fechaExpiracion?: Date;
  proveedorId?: number;
  proveedor?: Proveedor;
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'OTRO';

export type Venta = {
  id: number;
  subtotal: number;
  total: number;
  metodoPago: MetodoPago;
  detallesPago: any; // Usar tipo específico si se conoce la estructura JSON
  usuarioId: number;
  usuario: Usuario;
  cierreCajaId?: number;
  cierreCaja?: CierreCaja;
  detalles: DetalleVenta[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export type DetalleVenta = {
  id: number;
  ventaId: number;
  productoId: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  fechaCreacion: Date;
};

export type CierreCaja = {
  id: number;
  fechaApertura: Date;
  fechaCierre?: Date;
  montoInicial: number;
  montoFinal: number;
  diferencia: number;
  usuarioId: number;
  usuario: Usuario;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
  ventas: Venta[];
};

export type IngresoStock = {
  id: number;
  proveedorId: number;
  proveedor: Proveedor;
  productoId: number;
  producto: Producto;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  fechaIngreso: Date;
  fechaExpiracion?: Date;
  numeroFactura?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export type RegistroAuditoria = {
  id: number;
  tipoAccion: string;
  entidad: string;
  entidadId?: number;
  usuarioId: number;
  usuario: Usuario;
  detalles?: any;
  direccionIP?: string;
  agenteUsuario?: string;
  fechaCreacion: Date;
};

// Tipos para formularios
export type ProductoFormValues = Omit<
  Producto,
  'id' | 'fechaCreacion' | 'fechaActualizacion' | 'marca' | 'proveedor'
> & {
  marcaId: number;
  proveedorId?: number;
};

export type VentaFormValues = {
  metodoPago: MetodoPago;
  detalles: Array<{
    productoId: number;
    cantidad: number;
    descuento?: number;
  }>;
};

// Tipos para requests/responses API
export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
