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
exports.cierreCajaService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.cierreCajaService = {
    // Crear un nuevo cierre de caja
    crearCierreCaja(montoInicial, usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.cierreCaja.create({
                data: {
                    montoInicial,
                    usuarioId,
                },
            });
        });
    },
    // Obtener todos los cierres de caja
    obtenerCierres() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.cierreCaja.findMany({
                include: {
                    usuario: true, // Incluye los detalles del usuario que realizó el cierre
                },
            });
        });
    },
    // Cerrar una caja
    cerrarCaja(cierreCajaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cierreCaja = yield prisma.cierreCaja.update({
                where: { id: cierreCajaId },
                data: {
                    fechaCierre: new Date(), // Actualiza la fecha de cierre
                    montoFinal: 0, // Puede ser 0 si el monto no ha sido calculado, ajusta según sea necesario
                },
            });
            return cierreCaja;
        });
    },
    // Cerrar una caja automáticamente al finalizar el turno del cajero
    cierreAutomatico(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cierreCajaAbierto = yield prisma.cierreCaja.findFirst({
                where: {
                    usuarioId,
                    fechaCierre: null, // Solo consideramos cierres abiertos
                },
                orderBy: {
                    fechaApertura: 'desc', // Tomamos el cierre más reciente
                },
            });
            if (cierreCajaAbierto) {
                const ventasRealizadas = yield prisma.venta.count({
                    where: {
                        cierreCajaId: cierreCajaAbierto.id,
                    },
                });
                if (ventasRealizadas === 0) {
                    return yield prisma.cierreCaja.update({
                        where: { id: cierreCajaAbierto.id },
                        data: {
                            fechaCierre: new Date(),
                            montoFinal: cierreCajaAbierto.montoInicial,
                        },
                    });
                }
                const montoFinal = yield this.calcularMontoFinal(cierreCajaAbierto.id);
                return yield prisma.cierreCaja.update({
                    where: { id: cierreCajaAbierto.id },
                    data: {
                        fechaCierre: new Date(),
                        montoFinal: montoFinal,
                    },
                });
            }
            throw new Error('No se encontró un cierre de caja abierto para este usuario.');
        });
    },
    // Cierre manual de caja en caso de emergencia
    cierreManual(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cierreCajaAbierto = yield prisma.cierreCaja.findFirst({
                where: {
                    usuarioId,
                    fechaCierre: null,
                },
                orderBy: {
                    fechaApertura: 'desc',
                },
            });
            if (cierreCajaAbierto) {
                return yield prisma.cierreCaja.update({
                    where: { id: cierreCajaAbierto.id },
                    data: {
                        fechaCierre: new Date(),
                        montoFinal: 0, // Asignamos un monto final de 0 si es un cierre manual
                    },
                });
            }
            throw new Error('No se encontró un cierre de caja abierto para este usuario.');
        });
    },
    // Calcular el monto final de un cierre de caja basado en las ventas
    calcularMontoFinal(cierreCajaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ventas = yield prisma.venta.findMany({
                where: { cierreCajaId },
                include: {
                    detalles: true, // Obtener detalles de venta
                },
            });
            const montoTotalVentas = ventas.reduce((total, venta) => total + parseFloat(venta.total.toString()), 0);
            return montoTotalVentas;
        });
    },
};
