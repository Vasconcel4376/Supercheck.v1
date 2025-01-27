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
exports.productoService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.productoService = {
    // Crear un nuevo producto
    crearProducto(nombre, sku, descripcion, marcaId, precio, costo, stock, proveedorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.producto.create({
                data: {
                    nombre,
                    sku,
                    descripcion,
                    marcaId,
                    precio,
                    costo,
                    stock,
                    proveedorId,
                },
            });
        });
    },
    // Obtener todos los productos
    obtenerProductos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.producto.findMany({
                include: {
                    marca: true, // Incluye los detalles de la marca
                    proveedor: true, // Incluye los detalles del proveedor
                },
            });
        });
    },
};
