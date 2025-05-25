<template>
  <div style="height: 1200px; margin: 0 auto; padding: 20px;">

    <div v-if="storeEtiquetas.loading" class="overlay">
      <q-spinner size="80px" color="grey" />
    </div>

    <!-- Filtros y Botón Crear -->
    <div class="row q-mb-md items-center">
      <q-btn color="primary" icon="add" label="Nueva Etiqueta" class="q-mr-md" @click="abrirFormulario" />


      <q-select v-model="filtroSeleccionado" :options="opcionesFiltro" label="Filtrar por" outlined dense
        style="min-width: 200px;" @update:modelValue="aplicarFiltro" />
    </div>

    <!-- Tabla de Campañas -->
    <q-table title="Etiquetas" title-class="text-primary text-weight-bolder text-h5" :rows="etiquetas"
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
              {{ modoEdicion ? 'Editar Etiqueta' : 'Nuevo Etiqueta' }}
            </div>
            <q-btn flat dense icon="close" class="text-white" v-close-popup />
          </div>
        </q-card-section>

        <q-form @submit.prevent="guardarDatos">
          <q-card-section class="q-pt-md">
            
            <q-input outlined v-model="formulario.nombre" label="Nombre" class="q-my-md q-mx-md" :rules="rules.nombre"
              hide-bottom-space />
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
import { useEtiquetaClienteStore } from "../store/etiquetaCliente.js";
import { useUsuariosStore } from '../store/usuarios.js';
import { useQuasar, Notify } from "quasar";


const storeEtiquetas = useEtiquetaClienteStore();
const storeUsuarios = useUsuariosStore();
const $q = useQuasar();

// Estados
const usuarios = [];
const idUsuario = ref('')
let datos = {}
let options = ref(usuarios)
const etiquetas = ref([]);
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
  descripcion: '',
  idUsuario: ''

});




const rules = {
  nombre: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres',

  ],
  descripcion: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
  ]
};

// columnas de la tabla
const columnas = ref([
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'center' },
  { name: 'descripcion', label: 'Descripcion', field: 'descripcion', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]);






const cargarDatos = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('Filtro seleccionado:', filtroSeleccionado.value); // Debug

    let filtro = filtroSeleccionado.value?.value || 'Listar todos'; // Asegura que accedemos al value
    let response;

    if (filtro === 'Activos') {
      response = await storeEtiquetas.ListarActivos();
    } else if (filtro === 'Inactivos') {
      response = await storeEtiquetas.ListarInactivos();
    } else {
      response = await storeEtiquetas.ListarTodos();
    }

    console.log('Datos cargadas después del filtro:', response);
    etiquetas.value = response;

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

// Observa los cambios en filtroSeleccionado y aplica el filtro automáticamente
watch(filtroSeleccionado, () => {
  aplicarFiltro();
});
// Cargar campañas al montar el componente
onMounted(() => {
  cargarDatos();
  
});

// Cambiar estado de la campaña
const toggleEstado = async (etiqueta) => {
  try {
    if (etiqueta.estado) {
      await storeEtiquetas.desactivarEtiqueta(etiqueta._id);
    } else {
      await storeEtiquetas.activarEtiqueta(etiqueta._id);
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
    descripcion: '',
  };
  mostrarFormulario.value = true;
};


const editarDatos = (etiqueta) => {
  modoEdicion.value = true;
  formulario.value = {
    _id: etiqueta._id,
    nombre: etiqueta.nombre,
    descripcion: etiqueta.descripcion,

  };
  mostrarFormulario.value = true;
};

const guardarDatos = async () => {
  try {
    if (modoEdicion.value) {
      await storeEtiquetas.actualizarEtiqueta(
        formulario.value._id,
        formulario.value
      );
    } else {
      await storeEtiquetas.crearEtiqueta(formulario.value);
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
