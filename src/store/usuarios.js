import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from '../store/login.js';
import Usuario from '../pages/Usuario.vue';

export const useUsuariosStore = defineStore('usuarios', () => {
  const useLogin = useAuthStore();
  const usuarios = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Listar todos los clientes
  const ListarTodos = async () => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para la solicitud:', useLogin.token);

      const response = await axios.get('usuarios', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      usuarios.value = response.data;
      console.log('usuarios obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarTodos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Listar clientes activos
  const ListarActivos = async () => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      const response = await axios.get('usuarios/listar/activos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      usuarios.value = response.data;
      console.log('usuarios activos obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarActivos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Listar clientes inactivos
  const ListarInactivos = async () => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para la solicitud:', useLogin.token);

      const response = await axios.get('usuarios/listar/inactivos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      usuarios.value = response.data;
      console.log('Usuarios inactivos obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarInactivos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const crearUsuario = async (usuario) => {
    console.log('usuario recibido:', usuario);
    
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.post('usuarios/agregar', usuario, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      console.log('usuario creado:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al crear usuario:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const actualizarUsuario = async (id, usuario) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.put(`usuarios/actualizar/${id}`, usuario, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      return response.data;
    } catch (err) {
      console.error('Error en actualizarCliente:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  

  const activarUsurio = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para activar usuario:', useLogin.token);

      const response = await axios.put(`usuarios/activar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`Usuario ${id} activado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al activar el usuario ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const desactivarUsuario = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para desactivar usuario:', useLogin.token);

      const response = await axios.put(`usuarios/desactivar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`Usuario ${id} desactivado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al desactivar el usuario ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  return {
    usuarios,
    loading,
    error,
    ListarTodos,
    ListarActivos,
    ListarInactivos,
    activarUsurio,
    desactivarUsuario,
    actualizarUsuario,
    crearUsuario,
  };
});
