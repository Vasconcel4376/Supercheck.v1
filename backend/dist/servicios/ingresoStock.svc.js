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
exports.ingresoStockService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.ingresoStockService = {
    // Crear un nuevo ingreso de stock
    crearIngreso(proveedorId, productoId, cantidad, costoUnitario) {
        return __awaiter(this, void 0, void 0, function* () {
            const costoTotal = cantidad * costoUnitario;
            return yield prisma.ingresoStock.create({
                data: {
                    proveedorId,
                    productoId,
                    cantidad,
                    costoUnitario,
                    costoTotal,
                },
            });
        });
    },
    // Obtener todos los ingresos de stock
    obtenerIngresos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.ingresoStock.findMany({
                include: {
                    proveedor: true, // Incluye los detalles del proveedor
                    producto: true, // Incluye los detalles del producto
                },
            });
        });
    },
};
