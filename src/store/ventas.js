import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from './auth.js';


export const useVentasStore = defineStore('venta', () => {
  const useLogin = useAuthStore();
  const venta = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Listar todos los ventas
  const ListarTodos = async () => {
    try {
      loading.value = true;
      error.value = null;

      if (!useLogin.token) {
        console.error("Token no disponible en el store.");
        throw new Error('El token de autenticación no está disponible.');
      }

      console.log('Token utilizado para la solicitud:', useLogin.token);

      const response = await axios.get('ventas/ventas', {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });

      venta.value = response.data;
      console.log('ventas obtenidos en el store:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error en ListarTodos:", error.message || error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  
  const crearVenta = async (venta) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.post('ventas/venta', venta, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      console.log('venta  creada:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al crear venta:', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
   const actualizarVenta = async (id, venta) => {
    try {
      loading.value = true;
      error.value = null;
  
      const response = await axios.put(`ventas/editar/${id}`, venta, {
        headers: {
          Authorization: `Bearer ${useLogin.token}`,
        },
      });
  
      return response.data;
    } catch (err) {
      console.error('Error en actualizar venta :', err.message || err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
 
  return {
   venta,
    loading,
    error,
    ListarTodos,
    crearVenta,
    actualizarVenta
  };
});
