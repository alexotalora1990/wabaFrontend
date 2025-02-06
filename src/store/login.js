// import { defineStore } from 'pinia';
// import axios from 'axios';

// export const useAuthStore = defineStore('auth', {
  
//   state: () => ({
//     isAuthenticated: false, // Estado de autenticación
//     token: null, // Token JWT
//   }),

//   actions: {
//     // Acción para iniciar sesión
//     async login(correo, contrasena) {
//       try {
//         const response = await axios.post('login', { correo, contrasena });
//         console.log('Token recibido del backend:', response.data.token);

//         // Guarda el token en el estado y en localStorage
//         this.token = response.data.token;
//         localStorage.setItem('token', this.token);

//         // Cambia el estado de autenticación
//         this.isAuthenticated = true;
//       } catch (error) {
//         console.error('Error de autenticación:', error.response?.data || error.message);
//         throw new Error('Credenciales incorrectas. Intenta nuevamente.');
//       }
//     },

//     // Acción para cerrar sesión
//     logout() {
//       this.token = null;
//       this.isAuthenticated = false;
//       localStorage.removeItem('token'); // Elimina el token de localStorage
//     },

//     // Cargar el estado de autenticación desde localStorage
//     loadAuthState() {
//       const token = localStorage.getItem('token');
//       if (token) {
//         this.token = token;
//         this.isAuthenticated = true;
//       }
//     },
//   },
// });
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false, // Estado de autenticación
    token: null, // Token JWT
  }),

  actions: {
    // Acción para iniciar sesión
    async login(correo, contrasena) {
      try {
        const response = await axios.post('login', { correo, contrasena });
        console.log('Token recibido del backend:', response.data.token);

        // Guarda el token en el estado y en localStorage
        this.token = response.data.token;
        localStorage.setItem('token', this.token);

        // Cambia el estado de autenticación
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
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
      }
    },
  },
});