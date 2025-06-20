<template>
  <div style="height: 1200px; margin: 0 auto; padding: 20px;">

    <div v-if="storeVentas.loading" class="overlay">
      <q-spinner size="80px" color="grey" />
    </div>

    <!-- Filtros y Botón Crear -->
    <div class="row q-mb-md items-center">
      <q-btn color="primary" icon="add" label="Nueva Venta" class="q-mr-md" @click="abrirFormulario" />


      <q-select v-model="filtroSeleccionado" :options="opcionesFiltro" label="Filtrar por" outlined dense
        style="min-width: 200px;" @update:modelValue="aplicarFiltro" />
    </div>

    <!-- Tabla de Campañas -->
    <q-table title="Ventas" title-class="text-primary text-weight-bolder text-h5" :rows="ventas"
      :columns="columnas" row-key="_id" :loading="loading" :filter="busqueda" class="shadow-1">
      <template v-slot:top-right>
        <q-input v-model="busqueda" outlined dense placeholder="Buscar..." class="q-ml-md">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Columna Estado -->
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-badge :color="props.row.estado ? 'positive' : 'negative'"
            :label="props.row.estado ? 'Activa' : 'Inactiva'" />
        </q-td>
      </template>

      <!-- Columna Acciones -->
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn flat color="blue" icon="edit" @click="editarDatos(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn flat :color="props.row.estado ? 'red' : 'green'" :icon="props.row.estado ? 'toggle_off' : 'toggle_on'"
            @click="toggleEstado(props.row)">

            <q-tooltip>
              {{ props.row.estado ? "Desactivar" : "Activar" }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>


    <q-dialog v-model="mostrarFormulario" persistent>
      <q-card style="min-width: 500px">

        <q-card-section class="bg-primary text-white">
          <div class="row items-center justify-between">
            <div class="text-h6">
              {{ modoEdicion ? 'Editar Pago' : 'Nuevo Pago' }}
            </div>
            <q-btn flat dense icon="close" class="text-white" v-close-popup />
          </div>
        </q-card-section>

        <q-form @submit.prevent="guardarDatos">
          <q-card-section class="q-pt-md">
            <q-input outlined v-model="formulario.nombre" label="Nombre" class="q-my-md q-mx-md" :rules="rules.nombre"
              hide-bottom-space />
            <q-input outlined v-model="formulario.valor" label="Precio" class="q-my-md q-mx-md"
              :rules="rules.valor" hide-bottom-space />
              <q-input outlined v-model="formulario.periodo" label="Periodo" class="q-my-md q-mx-md"
              :rules="rules.periodo" hide-bottom-space />
              <q-input outlined v-model="formulario.descripcion" label="Descripcion" class="q-my-md q-mx-md"
              :rules="rules.descripcion" hide-bottom-space />
              

          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" outline color="red" class="custom-border" v-close-popup />
            <q-btn type="submit" color="primary" :label="modoEdicion ? 'Actualizar' : 'Crear'" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>





  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useVentasStore } from "../store/ventas.js";
import { useQuasar, Notify } from "quasar";


const storeVentas = useVentasStore();
const $q = useQuasar();

// Estados
const ventas = ref([]);
const busqueda = ref('');
const loading = ref(false);
const error = ref("")


// Filtros
const filtroSeleccionado = ref('Listar todos'); // Valor inicial
const opcionesFiltro = [
  { label: 'Listar todos', value: 'Listar todos' },
  { label: 'Activos', value: 'Activos' },
  { label: 'Inactivos', value: 'Inactivos' }
];

// Diálogos
const mostrarFormulario = ref(false);


// Formularios
const modoEdicion = ref(false);
const formulario = ref({
  _id: null,
  nombre: '',
  valor: '',
  periodo: '',
  descripcion:'',
  

});




const rules = {
  nombre: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres',

  ],
  valor: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
  ],
  periodo: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
  ],
  descripcion: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
  ]
};

// columnas de la tabla
const columnas = ref([
  { 
    name: 'cliente', 
    label: 'Cliente', 
    field: 'cliente',
    align: 'left',
    sortable: true
  },
  { 
    name: 'fecha', 
    label: 'Fecha', 
    field: 'fecha',
    format: val => val ? new Date(val).toLocaleDateString() : 'N/A',
    sortable: true
  },
  { 
    name: 'productos', 
    label: 'Productos', 
    field: row => row.productos.map(p => p.nombre).join(', '),
    sortable: false
  },
  { 
    name: 'totalVenta', 
    label: 'Total Venta', 
    field: 'totalVenta',
    format: val => val ? `$${Number(val).toLocaleString()}` : '$0',
    sortable: true
  },
  { 
    name: 'acciones', 
    label: 'Acciones', 
    align: 'center',
    sortable: false
  }
]);

const cargarDatos = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await storeVentas.ListarTodos();
    
    // Asegurarnos de que siempre trabajamos con el array de ventas
    ventas.value = response.ventas || [];
    
    // Opcional: Mostrar los totales en consola o usarlos en el UI
    console.log('Total general:', response.totalGeneral);
    console.log('Número de ventas:', response.totalVentas);
    
  } catch (err) {
    console.error('Error cargando datos:', err);
    error.value = err.message || "Error al cargar los datos";
    $q.notify({
      type: 'negative',
      message: error.value,
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

// Aplicar filtro manualmente
const aplicarFiltro = () => {
  console.log('Filtro seleccionado:', filtroSeleccionado.value);
  cargarDatos();
};

// Observa los cambios en `filtroSeleccionado` y aplica el filtro automáticamente
watch(filtroSeleccionado, () => {
  aplicarFiltro();
});
// Cargar campañas al montar el componente
onMounted(() => {
  cargarDatos();
});

// Cambiar estado de la campaña
const toggleEstado = async (pago) => {
  try {
    if (pago.estado) {
      await storeVentas.desactivar(pago._id);
    } else {
      await storeVentas.activarPago(pago._id);
    }
    await cargarDatos(); // Recargar después de cambiar el estado
    $q.notify({
      type: 'positive',
      message: 'Estado actualizado correctamente',
      position: 'top-right'
    });
  } catch (error) {
    console.error('Error cambiando estado:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cambiar el estado',
      position: 'top-right'
    });
  }
};

const abrirFormulario = () => {
  modoEdicion.value = false;
  formulario.value = {
    nombre: '',
    valor: '',
    periodo:'',
    descripcion:'',
   
  };
  mostrarFormulario.value = true;
};


const editarDatos = (pago) => {
  modoEdicion.value = true;
  formulario.value = {
    _id: pago._id,
    nombre: pago.nombre,
    valor: pago.valor,
    periodo:pago.periodo,
    descripcion:pago.descripcion,
    

  };
  mostrarFormulario.value = true;
};

const guardarDatos = async () => {
  try {
    if (modoEdicion.value) {
      await storeVentas.actualizarVenta(
        formulario.value._id,
        formulario.value
      );
    } else {
      await storeVentas.crearVenta(formulario.value);
    }
    await cargarDatos();
    mostrarFormulario.value = false;
    mostrarExito('Etiqueta guardado correctamente');
  } catch (error) {
    mostrarError('Error guardando etiqueta');
  }
};
const mostrarExito = (mensaje) => {
  $q.notify({
    type: 'positive',
    message: mensaje,
    position: 'top-right'
  });
};

const mostrarError = (mensaje) => {
  $q.notify({
    type: 'negative',
    message: mensaje,
    position: 'top-right'
  });
};

</script>

<style>
.custom-select {
  font-size: 14px;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: white;
  color: #333;
  min-width: 200px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.shadow-1 {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.custom-border {
  border: 2px solid black
    /* Borde más grueso y color blanco */

}
</style>