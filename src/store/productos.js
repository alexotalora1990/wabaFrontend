import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './auth.js';


export const usePagoStore = defineStore('producto', () => {
  const useLogin = useAuthStore();
  const producto = ref([]);
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

      const response = await axios.get('productos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      producto.value = response.data;
      console.log('Productos obtenidos en el store:', response.data);
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

      const response = await axios.get('productos/listar/activos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

     producto.value = response.data;
      console.log('Productos activas obtenidos en el store:', response.data);
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

      const response = await axios.get('productos/listar/inactivos', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      producto.value = response.data;
      console.log('Productos del sistema inactivos obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en Listar Inactivos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const crearProducto = async (producto) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.post('productos/agregar', producto, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      console.log('Produto del Sistema creada:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al crear producto:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const actualizarProdcuto = async (id, producto) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.put(`produstos/actualizar/${id}`, producto, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      return response.data;
    } catch (err) {
      console.error('Error en actualizar producto :', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  

  const activarProducto = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para activar producto:', useLogin.token);

      const response = await axios.put(`productos/activar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`producto ${id} activado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al activar el producto ${id}:`, error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const desactivarProducto = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para desactivar Producto:', useLogin.token);

      const response = await axios.put(`produtos/desactivar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      console.log(`Producto ${id} desactivado correctamente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al desactivar el producto${id}:`, error.message || error);
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
    activarProducto,
    desactivarProducto,
    actualizarProdcuto,
    crearProducto,
  };
});
