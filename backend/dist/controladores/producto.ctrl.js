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
exports.productoController = void 0;
const producto_svc_1 = require("../servicios/producto.svc");
exports.productoController = {
    // Crear un nuevo producto
    crearProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, sku, descripcion, marcaId, precio, costo, stock, proveedorId, } = req.body;
                // Validar los datos recibidos
                if (!nombre || !sku || !precio || !costo || stock === undefined) {
                    res.status(400).json({ error: 'Faltan datos necesarios' });
                    return;
                }
                // Llamar al servicio para crear el producto
                const producto = yield producto_svc_1.productoService.crearProducto(nombre, sku, descripcion, marcaId, precio, costo, stock, proveedorId);
                // Responder con el producto creado
                res.status(201).json(producto);
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
    // Obtener todos los productos
    obtenerProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productos = yield producto_svc_1.productoService.obtenerProductos();
                res.status(200).json(productos);
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
