<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
    <!-- Loading -->
    <div v-if="loading" class="overlay">
      <q-spinner size="80px" color="grey" />
    </div>

    <!-- Filtros y Botón Crear -->
    <div class="row q-mb-md items-center">
      <q-btn color="primary" icon="add" label="Nueva Campaña" class="q-mr-md" @click="abrirCreacion" />
      <q-select v-model="filtroSeleccionado" :options="opcionesFiltro" label="Filtrar por" outlined dense
        style="min-width: 200px;" @update:modelValue="aplicarFiltro" />
    </div>

    <!-- Tabla de Campañas -->
    <q-table title="Campañas Usuario" title-class="text-primary text-weight-bolder text-h5" :rows="campanias"
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
          <q-btn flat color="blue" icon="edit" @click="editarCampania(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn flat :color="props.row.estado ? 'red' : 'green'" :icon="props.row.estado ? 'toggle_off' : 'toggle_on'"
            @click="toggleEstado(props.row)">
            <q-tooltip>
              {{ props.row.estado ? "Desactivar" : "Activar" }}
            </q-tooltip>
          </q-btn>
          <q-btn flat color="teal" icon="list" @click="abrirPasos(props.row)">
            <q-tooltip>Ver Pasos</q-tooltip>
          </q-btn>
          <q-btn flat color="red" icon="delete" @click="eliminarCampania(props.row)">
            <q-tooltip>Eliminar Campaña</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo para Crear/Editar Campaña -->
    <q-dialog v-model="mostrarDialogoCampaña" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="row item-center justify-between">
            <div class="text-h6">
              {{ modoEdicion ? 'Editar Campaña' : 'Nueva Campaña' }}
            </div>
            <q-btn flat dense icon="close" type="submit" class="text-white" v-close-popup />
          </div>
        </q-card-section>

        <q-form @submit.prevent="guardarCampania">
          <q-card-section class="q-pt-md">
            <q-input v-model="formulario.nombre" label="Nombre de la campaña" outlined
              :rules="[val => !!val || 'Campo obligatorio']" class="q-mb-md" />

            <div class="text-subtitle1 q-mb-sm">Pasos:</div>

            <!-- Lista de Pasos -->
            <div v-for="(paso, index) in formulario.pasos" :key="index" class="row q-gutter-sm q-mb-md">
              <q-input v-model.number="paso.numero" label="Paso" type="number" outlined dense style="width: 80px"
                :rules="[val => val > 0 || 'Número inválido']" />

              <q-input v-model="paso.link" label="URL" outlined dense class="col-grow"
                :rules="[val => !!val || 'URL requerida']" />

              <q-input v-model="paso.descripcion" label="Descripción" outlined dense class="col-grow"
                :rules="[val => !!val || 'Descripción requerida']" />

              <q-btn flat color="red" icon="remove" @click="eliminarPasoFormulario(index)">
                <q-tooltip>Eliminar Paso</q-tooltip>
              </q-btn>
            </div>

            <q-btn color="primary" icon="add" label="Agregar paso" class="q-mt-md" @click="agregarPasoFormulario" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup color="red" class="custom-border" />
            <q-btn type="submit" color="primary" :label="modoEdicion ? 'Actualizar' : 'Crear'" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useCampaniaClienteStore } from '../store/campaniaCliente.js';
import { useUsuariosStore } from '../store/usuarios.js';

const $q = useQuasar();
const storeCampanias = useCampaniaClienteStore();
const storeUsuarios = useUsuariosStore();

// Estados
const campanias = ref([]);
const busqueda = ref('');
const loading = ref(false);
const error = ref("");
const idUsuario = ref("");  // Para almacenar el ID del usuario seleccionado

// Filtros
const filtroSeleccionado = ref('Listar todos');
const opcionesFiltro = [
  { label: 'Listar todos', value: 'Listar todos' },
  { label: 'Activos', value: 'Activos' },
  { label: 'Inactivos', value: 'Inactivos' }
];

// Datos del formulario de campaña
const formulario = ref({
  _id: null,
  nombre: '',
  pasos: [],
  idUsuario: ''
});

const modoEdicion = ref(false);

// Listado de usuarios
const usuarios = ref([]);

// Diálogos
const mostrarDialogoCampaña = ref(false);
const mostrarDialogoPasos = ref(false);
const mostrarDialogoPaso = ref(false);

// Columnas de la tabla de campañas
const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
];

// Función para cargar los usuarios
const cargarUsuarios = async () => {
  const response = await storeUsuarios.ListarActivos();
  usuarios.value = response.map(usuario => ({
    label: usuario.nombre,
    value: usuario._id
  }));
};

// Función para cargar las campañas de un usuario
const cargarCampaniasDeUsuario = async () => {
  if (idUsuario.value) {
    loading.value = true;
    try {
      const response = await storeCampanias.ListarPorUsuario(idUsuario.value);
      campanias.value = response;
    } catch (error) {
      console.error('Error al cargar campañas del usuario', error);
      $q.notify({
        type: 'negative',
        message: "Error al cargar campañas",
        position: 'top-right'
      });
    } finally {
      loading.value = false;
    }
  }
};

// Al seleccionar un usuario, se carga las campañas de ese usuario
const seleccionarUsuario = (usuarioId) => {
  idUsuario.value = usuarioId;
  cargarCampaniasDeUsuario();
};

// Aplicar filtro manualmente
const aplicarFiltro = () => {
  cargarCampaniasDeUsuario();
};

// Observa los cambios en `filtroSeleccionado` y aplica el filtro automáticamente
watch(filtroSeleccionado, () => {
  aplicarFiltro();
});

// Función para cargar las campañas al montar el componente
onMounted(() => {
  cargarUsuarios();  // Cargar la lista de usuarios
});

// Función para activar/desactivar campañas
const toggleEstado = async (campania) => {
  try {
    if (campania.estado) {
      await storeCampanias.desactivarcampania(campania._id);
    } else {
      await storeCampanias.activarCampania(campania._id);
    }
    await cargarCampaniasDeUsuario(); // Recargar después de cambiar el estado
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

const abrirCreacion = () => {
  modoEdicion.value = false;
  formulario.value = { nombre: '', pasos: [] };
  mostrarDialogoCampaña.value = true;
};

</script>

<style scoped>
/* Tus estilos */
</style>
