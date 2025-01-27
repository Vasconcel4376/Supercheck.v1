import express from 'express';
import { prisma } from './utils/baseDatos';
import authRouter from './rutas/usuario.rutas';
import cierreCajaRouter from './rutas/cierreCaja.rutas';
import ingresoStockRouter from './rutas/ingresoStockRutas';
import marcaRouter from './rutas/marca.rutas';
import productoRouter from './rutas/prodcutos.rutas';
import proveedorRouter from './rutas/proveedor.rutas';
import registroAuditoriaRouter from './rutas/registoAuditorias.rutas';
import ventaRouter from './rutas/ventas.rutas';

const app = express();
app.use(express.json());
// Middleware de errores

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/cierreCaja', cierreCajaRouter);
app.use('/api/ingresoStock', ingresoStockRouter);
app.use('/api/marca', marcaRouter);
app.use('/api/producto', productoRouter);
app.use('/api/proveedor', proveedorRouter);
app.use('/api/registroAuditoria', registroAuditoriaRouter);
app.use('/api/venta', ventaRouter);

const PORT = process.env.PORT || 5000;

prisma
  .$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  });
