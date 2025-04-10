import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './auth.js';


export const usePagoStore = defineStore('pago', () => {
  const useLogin = useAuthStore();
  const pago = ref([]);
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

      const response = await axios.get('pagos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      pago.value = response.data;
      console.log('Pagos obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarTodos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Listar Etiquetas activas
  const ListarActivos = async () => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para la solicitud:', useLogin.token);

      const response = await axios.get('pagos/listar/activos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

     pago.value = response.data;
      console.log('Etiquetas activas obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarActivas:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Listar Etiquetas inactivos
  const ListarInactivos = async () => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para la solicitud:', useLogin.token);

      const response = await axios.get('pagos/listar/inactivos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      pago.value = response.data;
      console.log('Pagos del sistema inactivos obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarInactivos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const crearPago = async (pago) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.post('pagos/agregar', pago, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      console.log('Pago del Sistema creada:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al crear pago:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const actualizarPago = async (id, pago) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.put(`pagos/actualizar/${id}`, pago, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      return response.data;
    } catch (err) {
      console.error('Error en actualizar pagos :', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  

  const activarPago = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para activar cliente:', useLogin.token);

      const response = await axios.put(`pagos/activar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`Etiqueta ${id} activado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al activar el pago ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const desactivarPago = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para desactivar Pago:', useLogin.token);

      const response = await axios.put(`pagos/desactivar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`Etiqueta ${id} desactivado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al desactivar el pago ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  return {
   pago ,
    loading,
    error,
    ListarTodos,
    ListarActivos,
    ListarInactivos,
    activarPago,
    desactivarPago,
    actualizarPago,
    crearPago,
  };
});
