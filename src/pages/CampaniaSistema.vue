<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">


   
    <!-- Loading -->
     
    <div v-if="storeCampanias.loading" class="overlay">
      <q-spinner size="80px" color="grey" />
    </div>

    <!-- Filtros y Botón Crear -->
    <div class="row q-mb-md items-center">
      <q-btn 
      v-if="authStore.hasrol('admin') || authStore.hasrol('ayudante')"
      color="primary" 
      icon="add" 
      label="Nueva Campaña" 
      class="q-mr-md"
       @click="abrirCreacion" />


      <q-select v-model="filtroSeleccionado" :options="opcionesFiltro" label="Filtrar por" outlined dense
        style="min-width: 200px;" @update:modelValue="aplicarFiltro" />
    </div>

    <!-- Tabla de Campañas -->
    <q-table title="Campañas Sistema" title-class="text-primary text-weight-bolder text-h5" :rows="campanias"
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
          <q-btn 
           v-if="authStore.hasrol('admin') || authStore.hasrol('ayudante')"
          flat color="blue" icon="edit" @click="editarCampania(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn 
           v-if="authStore.hasrol('admin') || authStore.hasrol('ayudante')"
          flat :color="props.row.estado ? 'red' : 'green'" :icon="props.row.estado ? 'toggle_off' : 'toggle_on'"
            @click="toggleEstado(props.row)">

            <q-tooltip>
              {{ props.row.estado ? "Desactivar" : "Activar" }}
            </q-tooltip>
          </q-btn>
          <q-btn flat color="teal" icon="list" @click="abrirPasos(props.row)">
            <q-tooltip>Ver Pasos</q-tooltip>
          </q-btn>
          <q-btn 
          v-if="authStore.hasrol('admin') || authStore.hasrol('ayudante')"
          flat color="red" icon="delete" @click="eliminarCampania(props.row)">
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
            <q-btn flat dense icon="close" type="submit" class="text-white" v-close-popup  />
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

            <q-btn 
             v-if="authStore.hasrol('admin') || authStore.hasrol('ayudante')"
            color="primary" icon="add" label="Agregar paso" class="q-mt-md" @click="agregarPasoFormulario" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup color="red" class="custom-border"/>
            <q-btn type="submit" color="primary" :label="modoEdicion ? 'Actualizar' : 'Crear'" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Diálogo para Ver/Editar Pasos -->
    <q-dialog v-model="mostrarDialogoPasos" full-width>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Pasos de: {{ campaniaSeleccionada?.nombre }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-table :rows="pasos" :columns="columnasPasos" row-key="_id" flat bordered>
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" class="q-gutter-x-sm">
                <!-- Botón de editar con tooltip -->
                <q-btn 
                v-if="authStore.hasrol('admin') || authStore.hasrol('ayudante')"
                flat color="blue" icon="edit" @click="editarPaso(props.row)">
                  <q-tooltip>Editar paso</q-tooltip>
                </q-btn>

                <!-- Botón de eliminar con tooltip -->
                <q-btn 
                v-if="authStore.hasrol('admin') || authStore.hasrol('ayudante')"
                flat color="red" icon="delete" @click="confirmarEliminarPaso(props.row)">
                  <q-tooltip>Eliminar paso</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <q-btn 
           v-if="authStore.hasrol('admin') || authStore.hasrol('ayudante')"
          color="primary" icon="add" label="Nuevo Paso" class="q-mt-md" @click="abrirCreacionPaso" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Diálogo para Crear/Editar Paso -->
    <q-dialog v-model="mostrarDialogoPaso">
     
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ modoEdicionPaso ? 'Editar Paso' : 'Nuevo Paso' }}
          </div>
        </q-card-section>

        <q-form
        
         @submit.prevent="guardarPaso">
          <q-card-section class="q-pt-md">
            <q-input v-model.number="formularioPaso.numero" label="Número de paso" type="number" outlined
              :rules="[val => val > 0 || 'Número inválido']" class="q-mb-md" />

            <q-input v-model="formularioPaso.link" label="URL" outlined :rules="[val => !!val || 'URL requerida']"
              class="q-mb-md" />

            <q-input v-model="formularioPaso.descripcion" label="Descripción" outlined
              :rules="[val => !!val || 'Descripción requerida']" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn type="submit" color="primary" :label="modoEdicionPaso ? 'Actualizar' : 'Crear'" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useCampaniaSistemaStore } from '../store/campaniaSistema.js';
import { useAuthStore } from '../store/auth.js';

const $q = useQuasar();
const storeCampanias = useCampaniaSistemaStore();
const authStore = useAuthStore();


// Estados
const campanias = ref([]);
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
const mostrarDialogoCampaña = ref(false);
const mostrarDialogoPasos = ref(false);
const mostrarDialogoPaso = ref(false);

// Formularios
const modoEdicion = ref(false);
const formulario = ref({
  _id: null,
  nombre: '',
  pasos: []
});

const modoEdicionPaso = ref(false);
const formularioPaso = ref({
  _id: null,
  numero: '',
  link: '',
  descripcion: ''
});

// Datos temporales
const campaniaSeleccionada = ref(null);
const pasos = ref([]);


// Columnas de la tabla
const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
];

const columnasPasos = [
  { name: 'numero', label: 'Paso', field: 'numero', align: 'left' },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion' },
  { name: 'link', label: 'URL', field: 'link' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
];




// Método para cargar campañas según el filtro

const cargarCampanias = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('Filtro seleccionado:', filtroSeleccionado.value); // Debug

    let filtro = filtroSeleccionado.value?.value || 'Listar todos'; // Asegura que accedemos al `value`
    let response;

    if (filtro === 'Activos') {
      response = await storeCampanias.ListarActivos();
    } else if (filtro === 'Inactivos') {
      response = await storeCampanias.ListarInactivos();
    } else {
      response = await storeCampanias.ListarTodos();
    }

    console.log('Campañas cargadas después del filtro:', response);
    campanias.value = response;

  } catch (err) {
    console.error('Error cargando campañas:', err);
    error.value = err.message || "Error al cargar las campañas";
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
  cargarCampanias();
};

// Observa los cambios en `filtroSeleccionado` y aplica el filtro automáticamente
watch(filtroSeleccionado, () => {
  aplicarFiltro();
});
// Cargar campañas al montar el componente
onMounted(() => {
  cargarCampanias();
});

// Cambiar estado de la campaña
const toggleEstado = async (campania) => {
  try {
    if (campania.estado) {
      await storeCampanias.desactivarcampania(campania._id);
    } else {
      await storeCampanias.activarCampania(campania._id);
    }
    await cargarCampanias(); // Recargar después de cambiar el estado
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

const editarCampania = (campania) => {
  modoEdicion.value = true;
  formulario.value = {
    _id: campania._id,
    nombre: campania.nombre,
    pasos: JSON.parse(JSON.stringify(campania.pasos)) || []
  };
  mostrarDialogoCampaña.value = true;
};

const guardarCampania = async () => {
  try {
    if (modoEdicion.value) {
      await storeCampanias.actualizarCampania(
        formulario.value._id,
        formulario.value
      );
    } else {
      await storeCampanias.crearCampania(formulario.value);
    }
    await cargarCampanias();
    mostrarDialogoCampaña.value = false;
    mostrarExito('Campaña guardada correctamente');
  } catch (error) {
    mostrarError('Error guardando campaña');
  }
};


const eliminarCampania = async (idCampania) => {
  try {
    await storeCampanias.eliminarCampania(idCampania);
    console.log('Campaña eliminada exitosamente');
    // Aquí podrías actualizar la lista de campañas o mostrar un mensaje de éxito
  } catch (error) {
    console.error('Error al eliminar campaña:', error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
};



const abrirPasos = (campania) => {
  campaniaSeleccionada.value = campania;
  pasos.value = campania.pasos;
  mostrarDialogoPasos.value = true;
};

const abrirCreacionPaso = () => {
  modoEdicionPaso.value = false;
  formularioPaso.value = { numero: '', link: '', descripcion: '' };
  mostrarDialogoPaso.value = true;
};




const editarPaso = (paso) => {
  modoEdicionPaso.value = true;
  formularioPaso.value = { ...paso };
  mostrarDialogoPaso.value = true;
};

const guardarPaso = async () => {
  try {
    if (modoEdicionPaso.value) {
      // Editar paso
      await storeCampanias.editarPaso(
        campaniaSeleccionada.value._id,
        formularioPaso.value._id,
        formularioPaso.value
      );

      // ✅ Actualizar el paso en la lista local en tiempo real
      const index = pasos.value.findIndex(p => p._id === formularioPaso.value._id);
      if (index !== -1) {
        // Usamos `.splice()` para que Vue detecte la modificación del array
        pasos.value.splice(index, 1, { ...formularioPaso.value });
      }
    } else {
      // Crear paso
      const nuevoPaso = await storeCampanias.agregarPaso(
        campaniaSeleccionada.value._id,
        formularioPaso.value
      );

      // ✅ Agregar el nuevo paso correctamente a la lista local
      pasos.value = [...pasos.value, nuevoPaso]; // Generamos una nueva referencia al array
      const index = pasos.value.findIndex(p => p._id === formularioPaso.value._id);
      if (index !== -1) {
        // Usamos `.splice()` para que Vue detecte la modificación del array
        pasos.value.splice(index, 1, { ...formularioPaso.value });
      }

    }

    mostrarDialogoPaso.value = false;
    cargarCampanias()
    mostrarExito('Paso guardado correctamente');
  } catch (error) {
    mostrarError('Error guardando paso');
  }
};




const confirmarEliminarPaso = (paso) => {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Eliminar este paso?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await storeCampanias.eliminarPaso(
        campaniaSeleccionada.value._id,
        paso._id
      );

      // 🔥 Forzar reactividad con `splice()`
      const index = pasos.value.findIndex(p => p._id === paso._id);
      if (index !== -1) {
        pasos.value.splice(index, 1);
      }

      mostrarExito('Paso eliminado correctamente');
    } catch (error) {
      mostrarError('Error eliminando paso');
    }
  });
};



const agregarPasoFormulario = () => {
  formulario.value.pasos.push({
    numero: '',
    link: '',
    descripcion: ''
  });
};

const eliminarPasoFormulario = (index) => {
  formulario.value.pasos.splice(index, 1);
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

<style scoped>
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
  border: 2px solid black /* Borde más grueso y color blanco */
  
}
</style>
