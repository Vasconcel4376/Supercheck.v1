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
exports.ingresoStockController = void 0;
const ingresoStock_svc_1 = require("../servicios/ingresoStock.svc");
exports.ingresoStockController = {
    // Crear un nuevo ingreso de stock
    crearIngreso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { proveedorId, productoId, cantidad, costoUnitario } = req.body;
                // Validar datos
                if (!proveedorId || !productoId || !cantidad || !costoUnitario) {
                    res.status(400).json({ error: 'Faltan datos necesarios' });
                    return;
                }
                // Crear el ingreso usando el servicio
                const ingreso = yield ingresoStock_svc_1.ingresoStockService.crearIngreso(proveedorId, productoId, cantidad, costoUnitario);
                // Responder con el ingreso creado
                res.status(201).json(ingreso);
            }
            catch (error) {
                // Verificar si el error es una instancia de Error
                if (error instanceof Error) {
                    // Si es un Error, acceder a su mensaje
                    console.error(error.message);
                    res.status(500).json({ error: error.message });
                }
                else {
                    // Si el error no es una instancia de Error, se maneja como error desconocido
                    console.error('Error desconocido');
                    res.status(500).json({ error: 'Ocurrió un error desconocido' });
                }
            }
        });
    },
    // Obtener todos los ingresos de stock
    obtenerIngresos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ingresos = yield ingresoStock_svc_1.ingresoStockService.obtenerIngresos();
                res.status(200).json(ingresos);
            }
            catch (error) {
                // Verificar si el error es una instancia de Error
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
