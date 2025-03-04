import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './login.js';


export const useCampaniaClienteStore = defineStore('campaniaClientes', () => {
  const useLogin = useAuthStore();
  const campaniaCliente = ref([]);
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

      const response = await axios.get('campaniasCliente', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      campaniaCliente.value = response.data;
      console.log('Campañas del Cliente obtenidos en el store:', response.data);
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

      const response = await axios.get('campaniasCliente/listar/activos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      campaniaCliente.value = response.data;
      console.log('Campañas activas obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en Listar Activas:", error.message || error);
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

      const response = await axios.get('campaniasCliente/listar/inactivos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      campaniaCliente.value = response.data;
      console.log('Campañas  inactivos obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en Listar Inactivos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const crearCampania = async (campania) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.post('campaniasCliente/agregar', campania, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      console.log('Campaña  creada:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al crear Campaña del sistema:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const actualizarCampania = async (id, campania) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.put(`campaniasCliente/actualizar/${id}`, campania, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      return response.data;
    } catch (err) {
      console.error('Error en actualizar Campaña :', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  

  const activarCampania = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para activar :', useLogin.token);

      const response = await axios.put(`campaniasCliente/activar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`Campaña ${id} activado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al activar el Campaña ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const desactivarcampania = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para desactivar:', useLogin.token);

      const response = await axios.put(`campaniasCliente/desactivar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`campaña ${id} desactivado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al desactivar el campaña ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  //pasos
//agregar paso

const agregarPaso = async (idCampania, paso) => {
  try {
    loading.value = true;
    error.value = null;

    const response = await axios.post(`campaniasCliente/${idCampania}/agregarPaso`, paso, {
      headers: {
        Authorization: `Bearer ${useLogin.token}`,
      },
    });

    console.log('Paso agregado a la campaña:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error al agregar paso:', err.message || err);
    throw err;
  } finally {
    loading.value = false;
  }
};
//actualizar paso
const editarPaso = async (idCampania, idPaso, paso) => {
  try {
    loading.value = true;
    error.value = null;

    const response = await axios.put(`campaniasCliente/${idCampania}/editarPaso/${idPaso}`, paso, {
      headers: {
        Authorization: `Bearer ${useLogin.token}`,
      },
    });

    console.log('Paso editado en la campaña:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error al editar paso:', err.message || err);
    throw err;
  } finally {
    loading.value = false;
  }
};
//eliminar paso
const eliminarPaso = async (idCampania, idPaso) => {
  try {
    loading.value = true;
    error.value = null;

    const response = await axios.delete(`campaniasCliente/${idCampania}/eliminarPaso/${idPaso}`, {
      headers: {
        Authorization: `Bearer ${useLogin.token}`,
      },
    });

    console.log('Paso eliminado de la campaña:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error al eliminar paso:', err.message || err);
    throw err;
  } finally {
    loading.value = false;
  }
};
const eliminarCampania = async (idCampania) => {
  try {
    loading.value = true;
    error.value = null;

    const response = await axios.delete(`campaniasCliente/eliminar/${idCampania}`, {
      headers: {
        Authorization: `Bearer ${useLoginStore().token}`,
      },
    });

    console.log('Campaña eliminada:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error al eliminar campaña:', err.message || err);
    error.value = err.message || 'Error al eliminar la campaña';
    throw err;
  } finally {
    loading.value = false;
  }
};

  return {
    campaniaCliente,
    loading,
    error,
    ListarTodos,
    ListarActivos,
    ListarInactivos,
    activarCampania,
    desactivarcampania,
    actualizarCampania,
    crearCampania,
    agregarPaso,
    editarPaso,
    eliminarPaso,
    eliminarCampania
  };
});