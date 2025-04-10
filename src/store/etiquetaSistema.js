import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.js';

export const useEtiquetaSistemaStore = defineStore('etiquetaSistemas', () => {
  const useLogin = useAuthStore();
  const etiquetaSistema = ref([]);
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

      const response = await axios.get('etiquetaSistemas', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      etiquetaSistema.value = response.data;
      console.log('Etiquetas del Sistema obtenidos en el store:', response.data);
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

      const response = await axios.get('etiquetaSistemas/listar/activos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      etiquetaSistema.value = response.data;
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

      const response = await axios.get('etiquetaSistemas/listar/inactivos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      etiquetaSistema.value = response.data;
      console.log('Etiquetas del sistema inactivos obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarInactivos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const crearEtiqueta = async (etiqueta) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.post('etiquetaSistemas/agregar', etiqueta, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      console.log('Etiqueta del Sistema creada:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al crear etiqueta del sistema:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const actualizarEtiqueta = async (id, etiqueta) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.put(`etiquetaSistemas/actualizar/${id}`, etiqueta, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      return response.data;
    } catch (err) {
      console.error('Error en actualizar etiquetas del sistema:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  

  const activarEtiqueta = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para activar cliente:', useLogin.token);

      const response = await axios.put(`etiquetaSistemas/activar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`Etiqueta ${id} activado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al activar el etiquueta ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const desactivarEtiqueta = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para desactivar Etiqueta:', useLogin.token);

      const response = await axios.put(`etiquetaSistemas/desactivar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`Etiqueta ${id} desactivado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al desactivar el etiqueta ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  return {
    etiquetaSistema,
    loading,
    error,
    ListarTodos,
    ListarActivos,
    ListarInactivos,
    activarEtiqueta,
    desactivarEtiqueta,
    actualizarEtiqueta,
    crearEtiqueta,
  };
});
