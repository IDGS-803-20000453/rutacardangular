// src/app/models/user.model.ts

export interface User {
    usuarioId: number;
    email: string;
    nombre: string;
    rolId: number;
    imagenURL: string;
    nombreRol: string;
    // Agrega cualquier otro campo relevante que desees incluir, excepto la contraseña
  }
  