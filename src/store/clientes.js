import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue';
import { useAuthStore } from '../store/auth.js';

export const useClientesStore = defineStore('clientes', () => {
  const useLogin = useAuthStore();
  const clientes = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const token = computed(()=>useLogin.token);

  // Listar todos los clientes



  
  const ListarTodos = async () => {
    try {
      loading.value = true;
      error.value = null;
  
      if (!token.value) {
        console.error("❌ Token no disponible en el store.");
        throw new Error("El token de autenticación no está disponible.");
      }
  
      console.log("🔍 Token utilizado para la solicitud:", token.value);
  
      const response = await axios.get("clientes", {
        headers: {
          Authorization: `Bearer ${token.value}` // ✅ Asegurar que se envía correctamente
        }
      });
  
      clientes.value = response.data;
      console.log("✅ Clientes obtenidos en el store:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error en ListarTodos:", error.message || error);
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

      console.log('Token utilizado para la solicitud:', useLogin.token);

      const response = await axios.get('clientes/listar/activos', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      clientes.value = response.data;
      console.log('Clientes activos obtenidos en el store:', response.data);
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

      const response = await axios.get('clientes/listar/inactivos', {
        headers: {
          Authorization: `Bearer ${token.value}`  ,
        },
      });

      clientes.value = response.data;
      console.log('Clientes inactivos obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarInactivos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const crearCliente = async (cliente) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.post('clientes/agregar', cliente, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
  
      console.log('Cliente creado:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al crear cliente:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const actualizarCliente = async (id, cliente) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.put(`clientes/actualizar/${id}`, cliente, {
        headers: {
          Authorization: `Bearer ${token.value}`,
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
  

  const activarCliente = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para activar cliente:', useLogin.token);

      const response = await axios.put(`clientes/activar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      console.log(`Cliente ${id} activado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al activar el cliente ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const desactivarCliente = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para desactivar cliente:', useLogin.token);

      const response = await axios.put(`clientes/desactivar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      console.log(`Cliente ${id} desactivado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al desactivar el cliente ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  return {
    clientes,
    loading,
    error,
    ListarTodos,
    ListarActivos,
    ListarInactivos,
    activarCliente,
    desactivarCliente,
    actualizarCliente,
    crearCliente,
  };
});