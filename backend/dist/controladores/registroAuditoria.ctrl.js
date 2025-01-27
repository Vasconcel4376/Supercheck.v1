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
exports.registroAuditoriaController = void 0;
const registroAuditoria_svc_1 = require("../servicios/registroAuditoria.svc");
exports.registroAuditoriaController = {
    // Crear un nuevo registro de auditoría
    crearRegistroAuditoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tipoAccion, entidad, entidadId, usuarioId, detalles, direccionIP, agenteUsuario, } = req.body;
                // Validar los datos recibidos
                if (!tipoAccion || !entidad || !usuarioId) {
                    res.status(400).json({ error: 'Faltan datos necesarios' });
                    return;
                }
                // Llamar al servicio para crear el registro de auditoría
                const registro = yield registroAuditoria_svc_1.registroAuditoriaService.crearRegistro(tipoAccion, entidad, entidadId, usuarioId, detalles, direccionIP, agenteUsuario);
                // Responder con el registro de auditoría creado
                res.status(201).json(registro);
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
    // Obtener todos los registros de auditoría
    obtenerRegistrosAuditoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registros = yield registroAuditoria_svc_1.registroAuditoriaService.obtenerRegistros();
                res.status(200).json(registros);
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
