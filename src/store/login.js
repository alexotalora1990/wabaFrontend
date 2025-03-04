import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  }),

  actions: {
    // Acción para iniciar sesión
    async login(correo, contrasena) {
      try {
        const response = await axios.post('/login', { correo, contrasena });
        console.log('Token recibido del backend:', response.data.token);

        // Guarda el token en el estado y en localStorage
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Error de autenticación:', error.response?.data || error.message);
        throw new Error('Credenciales incorrectas. Intenta nuevamente.');
      }
    },

    // Acción para cerrar sesión
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token'); // Elimina el token de localStorage
    },

    // Cargar el estado de autenticación desde localStorage
    loadAuthState() {
      const token = localStorage.getItem('token');
      this.token = token || null;
      this.isAuthenticated = !!token;
    },
  },
});
