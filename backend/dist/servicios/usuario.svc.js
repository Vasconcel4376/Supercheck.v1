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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarUsuarios = exports.eliminarUsuario = exports.cambiarContraseña = exports.actualizarUsuario = exports.obtenerUsuarios = exports.obtenerUsuarioPorCorreo = exports.obtenerUsuarioPorId = exports.crearUsuario = void 0;
const client_1 = require("@prisma/client");
const hashPassword_1 = require("../utils/hashPassword");
const apiError_1 = __importDefault(require("../utils/apiError"));
const prisma = new client_1.PrismaClient();
// Función de auditoría mejorada
const crearRegistroAuditoria = (usuarioId, tipoAccion, entidad, entidadId, detalles) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.registroAuditoria.create({
        data: {
            tipoAccion,
            entidad,
            entidadId,
            usuarioId,
            detalles: detalles !== null && detalles !== void 0 ? detalles : client_1.Prisma.DbNull, // Usar valor por defecto para JSON
        },
    });
});
const crearUsuario = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioExistente = yield prisma.usuario.findUnique({
        where: { correo: datos.correo },
    });
    if (usuarioExistente) {
        throw new apiError_1.default(400, 'El correo electrónico ya está registrado');
    }
    const contraseñaHasheada = yield (0, hashPassword_1.hashPassword)(datos.contraseña);
    const nuevoUsuario = yield prisma.usuario.create({
        data: Object.assign(Object.assign({}, datos), { contraseña: contraseñaHasheada, rol: datos.rol || 'CAJERO' }),
        select: {
            id: true,
            nombre: true,
            correo: true,
            rol: true,
            activo: true,
            fechaCreacion: true,
            fechaActualizacion: true,
        },
    });
    yield crearRegistroAuditoria(nuevoUsuario.id, 'CREACION', 'USUARIO', nuevoUsuario.id, {
        accion: 'Creación de nuevo usuario',
        datos: nuevoUsuario,
    });
    return nuevoUsuario;
});
exports.crearUsuario = crearUsuario;
const obtenerUsuarioPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield prisma.usuario.findUnique({
        where: { id },
        select: {
            id: true,
            nombre: true,
            correo: true,
            rol: true,
            activo: true,
            fechaCreacion: true,
            fechaActualizacion: true,
        },
    });
    if (!usuario) {
        throw new apiError_1.default(404, 'Usuario no encontrado');
    }
    return usuario;
});
exports.obtenerUsuarioPorId = obtenerUsuarioPorId;
const obtenerUsuarioPorCorreo = (correo) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.usuario.findUnique({
        where: { correo },
    });
});
exports.obtenerUsuarioPorCorreo = obtenerUsuarioPorCorreo;
const obtenerUsuarios = (parametros) => __awaiter(void 0, void 0, void 0, function* () {
    const { pagina, limite, nombre, rol } = parametros;
    const saltar = (pagina - 1) * limite;
    // Filtro corregido
    const condicionesBusqueda = {
        AND: [
            nombre
                ? {
                    nombre: {
                        contains: nombre,
                        mode: 'insensitive', // Solución del error
                    },
                }
                : {},
            rol ? { rol } : {},
            { activo: true },
        ],
    };
    const [total, usuarios] = yield Promise.all([
        prisma.usuario.count({ where: condicionesBusqueda }),
        prisma.usuario.findMany({
            where: condicionesBusqueda,
            skip: saltar,
            take: limite,
            select: {
                id: true,
                nombre: true,
                correo: true,
                rol: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
            orderBy: { fechaCreacion: 'desc' },
        }),
    ]);
    return { usuarios, total };
});
exports.obtenerUsuarios = obtenerUsuarios;
const actualizarUsuario = (id, datos, usuarioActual) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioExistente = yield prisma.usuario.findUnique({
        where: { id },
    });
    if (!usuarioExistente) {
        throw new apiError_1.default(404, 'Usuario no encontrado');
    }
    if (datos.correo && datos.correo !== usuarioExistente.correo) {
        const correoExistente = yield prisma.usuario.findUnique({
            where: { correo: datos.correo },
        });
        if (correoExistente) {
            throw new apiError_1.default(400, 'El nuevo correo electrónico ya está en uso');
        }
    }
    if (datos.contraseña) {
        datos.contraseña = yield (0, hashPassword_1.hashPassword)(datos.contraseña);
    }
    const usuarioActualizado = yield prisma.usuario.update({
        where: { id },
        data: datos,
        select: {
            id: true,
            nombre: true,
            correo: true,
            rol: true,
            activo: true,
            fechaCreacion: true,
            fechaActualizacion: true,
        },
    });
    yield crearRegistroAuditoria(usuarioActual.id, 'ACTUALIZACION', 'USUARIO', id, {
        accion: 'Actualización de datos de usuario',
        cambios: datos,
    });
    return usuarioActualizado;
});
exports.actualizarUsuario = actualizarUsuario;
const cambiarContraseña = (usuarioId, contraseñaActual, nuevaContraseña) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield prisma.usuario.findUnique({
        where: { id: usuarioId },
    });
    if (!usuario) {
        throw new apiError_1.default(404, 'Usuario no encontrado');
    }
    const contraseñaValida = yield (0, hashPassword_1.comparePassword)(contraseñaActual, usuario.contraseña);
    if (!contraseñaValida) {
        throw new apiError_1.default(400, 'La contraseña actual es incorrecta');
    }
    const contraseñaHasheada = yield (0, hashPassword_1.hashPassword)(nuevaContraseña);
    yield prisma.usuario.update({
        where: { id: usuarioId },
        data: { contraseña: contraseñaHasheada },
    });
    yield crearRegistroAuditoria(usuarioId, 'ACTUALIZACION', 'USUARIO', usuarioId, {
        accion: 'Cambio de contraseña exitoso',
    });
});
exports.cambiarContraseña = cambiarContraseña;
const eliminarUsuario = (id, usuarioActual) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield prisma.usuario.findUnique({
        where: { id },
    });
    if (!usuario) {
        throw new apiError_1.default(404, 'Usuario no encontrado');
    }
    const tieneRelaciones = yield prisma.venta.findFirst({
        where: { usuarioId: id },
    });
    if (tieneRelaciones) {
        yield prisma.usuario.update({
            where: { id },
            data: { activo: false },
        });
    }
    else {
        yield prisma.usuario.delete({
            where: { id },
        });
    }
    yield crearRegistroAuditoria(usuarioActual.id, 'ELIMINACION', 'USUARIO', id, {
        accion: tieneRelaciones
            ? 'Desactivación de usuario'
            : 'Eliminación permanente de usuario',
    });
});
exports.eliminarUsuario = eliminarUsuario;
const buscarUsuarios = (busqueda) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.usuario.findMany({
        where: {
            OR: [
                {
                    nombre: {
                        contains: busqueda.toLowerCase(), // Convertir a minúsculas
                    },
                },
                {
                    correo: {
                        contains: busqueda.toLowerCase(), // Convertir a minúsculas
                    },
                },
            ],
            activo: true,
        },
        select: {
            id: true,
            nombre: true,
            correo: true,
            rol: true,
            activo: true,
            fechaCreacion: true,
            fechaActualizacion: true,
        },
        take: 10,
    });
});
exports.buscarUsuarios = buscarUsuarios;
