"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ventaController = void 0;
const ventas_svc_1 = require("../servicios/ventas.svc");
exports.ventaController = {
    // Crear una nueva venta
    crearVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usuarioId, productos, metodoPago, detallesPago } = req.body;
                // Validar los datos recibidos
                if (!usuarioId || !productos || productos.length === 0) {
                    res.status(400).json({ error: 'Faltan datos necesarios' });
                    return;
                }
                // Llamar al servicio para crear la venta
                const venta = yield ventas_svc_1.ventaService.crearVenta({
                    usuarioId,
                    productos,
                    metodoPago,
                    detallesPago,
                });
                // Responder con la venta creada
                res.status(201).json(venta);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                    res.status(500).json({ error: error.message });
                }
                else {
                    console.error('Error desconocido');
                    res.status(500).json({ error: 'Ocurrió un error desconocido' });
                }
            }
        });
    },
    // Obtener todas las ventas
    obtenerVentas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ventas = yield ventas_svc_1.ventaService.obtenerVentas();
                res.status(200).json(ventas);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                    res.status(500).json({ error: error.message });
                }
                else {
                    console.error('Error desconocido');
                    res.status(500).json({ error: 'Ocurrió un error desconocido' });
                }
            }
        });
    },
};
