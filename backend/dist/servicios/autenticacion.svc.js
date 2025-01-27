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
exports.servicioAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const baseDatos_1 = require("../utils/baseDatos");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.servicioAuth = {
    registrarUsuario(datos) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcryptjs_1.default.hash(datos.contraseña, 10);
            return baseDatos_1.prisma.usuario.create({
                data: {
                    nombre: datos.nombre,
                    correo: datos.correo,
                    contraseña: hash,
                },
            });
        });
    },
    iniciarSesion(correo, contraseña) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield baseDatos_1.prisma.usuario.findUnique({ where: { correo } });
            if (!usuario || !(yield bcryptjs_1.default.compare(contraseña, usuario.contraseña))) {
                throw new Error('Credenciales inválidas');
            }
            return {
                token: jsonwebtoken_1.default.sign({ usuarioId: usuario.id }, process.env.JWT_SECRET, {
                    expiresIn: '8h',
                }),
                usuario,
            };
        });
    },
};
