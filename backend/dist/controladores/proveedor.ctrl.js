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
exports.proveedorController = void 0;
const proveedor_svc_1 = require("../servicios/proveedor.svc");
exports.proveedorController = {
    // Crear un nuevo proveedor
    crearProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, contactoPrincipal, telefono, correo, direccion, calificacion, sitioWeb, } = req.body;
                // Validar los datos recibidos
                if (!nombre || !contactoPrincipal || !telefono || !correo) {
                    res.status(400).json({ error: 'Faltan datos necesarios' });
                    return;
                }
                // Llamar al servicio para crear el proveedor
                const proveedor = yield proveedor_svc_1.proveedorService.crearProveedor(nombre, contactoPrincipal, telefono, correo, direccion, calificacion, sitioWeb);
                // Responder con el proveedor creado
                res.status(201).json(proveedor);
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
    // Obtener todos los proveedores
    obtenerProveedores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const proveedores = yield proveedor_svc_1.proveedorService.obtenerProveedores();
                res.status(200).json(proveedores);
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
