"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const baseDatos_1 = require("./utils/baseDatos");
const usuario_rutas_1 = __importDefault(require("./rutas/usuario.rutas"));
const cierreCaja_rutas_1 = __importDefault(require("./rutas/cierreCaja.rutas"));
const ingresoStockRutas_1 = __importDefault(require("./rutas/ingresoStockRutas"));
const marca_rutas_1 = __importDefault(require("./rutas/marca.rutas"));
const prodcutos_rutas_1 = __importDefault(require("./rutas/prodcutos.rutas"));
const proveedor_rutas_1 = __importDefault(require("./rutas/proveedor.rutas"));
const registoAuditorias_rutas_1 = __importDefault(require("./rutas/registoAuditorias.rutas"));
const ventas_rutas_1 = __importDefault(require("./rutas/ventas.rutas"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Middleware de errores
// Rutas
app.use('/api/auth', usuario_rutas_1.default);
app.use('/api/cierreCaja', cierreCaja_rutas_1.default);
app.use('/api/ingresoStock', ingresoStockRutas_1.default);
app.use('/api/marca', marca_rutas_1.default);
app.use('/api/producto', prodcutos_rutas_1.default);
app.use('/api/proveedor', proveedor_rutas_1.default);
app.use('/api/registroAuditoria', registoAuditorias_rutas_1.default);
app.use('/api/venta', ventas_rutas_1.default);
const PORT = process.env.PORT || 5000;
baseDatos_1.prisma
    .$connect()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
});
