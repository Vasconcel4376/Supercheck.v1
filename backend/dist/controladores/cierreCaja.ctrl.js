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
exports.cierreCajaController = void 0;
const cierreCaja_svc_1 = require("../servicios/cierreCaja.svc");
exports.cierreCajaController = {
    // Crear un nuevo cierre de caja
    crearCierreCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { montoInicial, usuarioId } = req.body;
                // Validar los datos recibidos
                if (!montoInicial || !usuarioId) {
                    res.status(400).json({ error: 'Faltan datos necesarios' });
                    return;
                }
                // Llamar al servicio para crear el cierre de caja
                const cierreCaja = yield cierreCaja_svc_1.cierreCajaService.crearCierreCaja(montoInicial, usuarioId);
                // Responder con el cierre de caja creado
                res.status(201).json(cierreCaja);
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
    // Obtener todos los cierres de caja
    obtenerCierres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cierres = yield cierreCaja_svc_1.cierreCajaService.obtenerCierres();
                res.status(200).json(cierres);
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
    // Cerrar una caja
    cerrarCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cierreCajaId } = req.params;
                if (!cierreCajaId) {
                    res.status(400).json({ error: 'Faltan datos necesarios' });
                    return;
                }
                const cierre = yield cierreCaja_svc_1.cierreCajaService.cerrarCaja(parseInt(cierreCajaId));
                res.status(200).json(cierre);
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
    // Cierre automático de caja al final del turno
    cierreAutomatico(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuarioId } = req.params;
            try {
                const cierre = yield cierreCaja_svc_1.cierreCajaService.cierreAutomatico(Number(usuarioId));
                res.status(200).json(cierre);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Ocurrió un error desconocido' });
                }
            }
        });
    },
    // Cierre manual de caja en caso de emergencia
    cierreManual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuarioId } = req.params;
            try {
                const cierre = yield cierreCaja_svc_1.cierreCajaService.cierreManual(Number(usuarioId));
                res.status(200).json(cierre);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Ocurrió un error desconocido' });
                }
            }
        });
    },
};
