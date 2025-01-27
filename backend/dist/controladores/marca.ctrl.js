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
exports.marcaController = void 0;
const marca_svc_1 = require("../servicios/marca.svc");
exports.marcaController = {
    // Crear una nueva marca
    crearMarca(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, descripcion, logoUrl } = req.body;
                // Validar datos
                if (!nombre || !descripcion) {
                    res.status(400).json({ error: 'Faltan datos necesarios' });
                    return;
                }
                // Llamar al servicio para crear la marca
                const marca = yield marca_svc_1.marcaService.crearMarca(nombre, descripcion, logoUrl);
                // Responder con la marca creada
                res.status(201).json(marca);
            }
            catch (error) {
                // Manejo de errores
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
    // Obtener todas las marcas
    obtenerMarcas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const marcas = yield marca_svc_1.marcaService.obtenerMarcas();
                res.status(200).json(marcas);
            }
            catch (error) {
                // Manejo de errores
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
