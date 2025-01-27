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
exports.ventaService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.ventaService = {
    // Crear una nueva venta
    crearVenta(datos) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Definir detalles de la venta
                const detallesCalculados = yield Promise.all(datos.productos.map((_a) => __awaiter(this, [_a], void 0, function* ({ productoId, cantidad }) {
                    const producto = yield tx.producto.findUniqueOrThrow({
                        where: { id: productoId },
                        select: { precio: true, stock: true, nombre: true },
                    });
                    if (producto.stock < cantidad) {
                        throw new Error(`Stock insuficiente para ${producto.nombre}`);
                    }
                    return {
                        productoId,
                        cantidad,
                        precioUnitario: producto.precio.toNumber(),
                        subtotal: producto.precio.toNumber() * cantidad, // Usamos `number` para la multiplicación
                    };
                })));
                yield Promise.all(detallesCalculados.map(({ productoId, cantidad }) => tx.producto.update({
                    where: { id: productoId },
                    data: { stock: { decrement: cantidad } },
                })));
                const subtotal = detallesCalculados.reduce((sum, item) => sum + item.subtotal, // Usamos `number` en lugar de Prisma.Decimal
                0 // Usamos 0 como valor inicial
                );
                return tx.venta.create({
                    data: {
                        subtotal,
                        total: subtotal, // Usamos `subtotal` directamente
                        metodoPago: datos.metodoPago,
                        detallesPago: datos.detallesPago,
                        usuarioId: datos.usuarioId,
                        detalles: {
                            createMany: {
                                data: detallesCalculados.map((d) => ({
                                    productoId: d.productoId,
                                    cantidad: d.cantidad,
                                    precioUnitario: d.precioUnitario,
                                })),
                            },
                        },
                    },
                    include: { detalles: true },
                });
            }));
        });
    },
    // Obtener todas las ventas
    obtenerVentas() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.venta.findMany({
                include: {
                    detalles: true, // Incluye los detalles de la venta
                    usuario: true, // Incluye el usuario que realizó la venta
                },
            });
        });
    },
};
