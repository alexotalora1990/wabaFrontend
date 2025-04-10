import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    rol: localStorage.getItem('rol') || null,
    usuario: JSON.parse(localStorage.getItem("usuario")) || null,
    mensajeRecuperacion: '',
    errorRecuperacion: ''
  }),

  actions: {
    // ✅ LOGIN
    async login(correo, contrasena) {
      try {
        const response = await axios.post('/login', { correo, contrasena });

        console.log('Token recibido del backend:', response.data.token);
        console.log('Rol recibido del backend:', response.data.user.rol);
        console.log('Usuario recibido del backend:', response.data.user);

        if (!response.data.user || !response.data.user.rol) {
          throw new Error('El backend no devolvió el rol del usuario.');
        }

        this.token = response.data.token;
        this.rol = response.data.user.rol;
        this.usuario = response.data.user;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token);
        localStorage.setItem('rol', this.rol);
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        
      } catch (error) {
        console.error('Error de autenticación:', error.response?.data || error.message);
        throw new Error('Credenciales incorrectas. Intenta nuevamente.');
      }
    },

    // ✅ LOGOUT
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      this.rol = null;
      this.usuario = null;

      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('usuario');
    },

    // ✅ CARGAR AUTENTICACIÓN DESDE LOCALSTORAGE
    loadAuthState() {
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('rol');

      this.token = token || null;
      this.isAuthenticated = !!token;
      this.rol = rol || null;
    },

    // ✅ SOLICITAR RECUPERACIÓN DE CONTRASEÑA
    async solicitarRecuperacion(correo) {
      this.mensajeRecuperacion = '';
      this.errorRecuperacion = '';
      try {
        const res = await axios.post(`/auth/forgot-password`, { correo });
        this.mensajeRecuperacion = res.data.message;
      } catch (error) {
        this.errorRecuperacion = error.response?.data?.message || 'Error al enviar la solicitud';
      }
    },

    // ✅ RESTABLECER CONTRASEÑA
    async resetearContrasena(token, nuevaContrasena) {
      try {
        const res = await axios.post(`/auth/reset-password/${token}`, {
          nuevaContrasena
        });
        return res.data.message;
      } catch (error) {
        throw error.response?.data?.message || 'Error al restablecer la contraseña';
      }
    }
  },

  getters: {
    hasrol: (state) => (rol) => state.rol === rol,
  }
});
