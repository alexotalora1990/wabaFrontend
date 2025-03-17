import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    rol:localStorage.getItem('rol')|| null
  }),

  actions: {
    // Acción para iniciar sesión
    async login(correo, contrasena) {
      try {
        const response = await axios.post('/login', { correo, contrasena });
        console.log('Token recibido del backend:', response.data.token);
        console.log('Rol recibido del backend:', response.data.user.rol);
// Verifica que la respuesta tenga la estructura esperada
if (!response.data.user || !response.data.user.rol) {
  throw new Error('El backend no devolvió el rol del usuario.');
}

        // Guarda el token en el estado y en localStorage
        this.token = response.data.token;
        this.rol=response.data.user.rol;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token);
        localStorage.setItem('rol', this.rol)
        
      } catch (error) {
        console.error('Error de autenticación:', error.response?.data || error.message);
        throw new Error('Credenciales incorrectas. Intenta nuevamente.');
      }
    },

    // Acción para cerrar sesión
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      this.rol=null;
      localStorage.removeItem('token'); // Elimina el token de localStorage
      localStorage.removeItem('rol');
    },

    // Cargar el estado de autenticación desde localStorage
    loadAuthState() {
      const token = localStorage.getItem('token');
      const rol=localStorage.getItem('rol');
      this.token = token || null;
      this.isAuthenticated = !!token;
      this.rol=rol|| null
    },
  },
  getters:{
    hasrol:(state)=>(rol)=> state.rol===rol,
  },
});
