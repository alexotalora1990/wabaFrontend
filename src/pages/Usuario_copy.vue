<template>
  <div style="height: 1200px; margin: 0 auto; padding: 20px;">

    <div v-if="storeUsuarios.loading" class="overlay">
      <q-spinner size="80px" color="grey" />
    </div>

    <!-- Filtros y Botón Crear -->
    <div class="row q-mb-md items-center">
      <q-btn color="primary" icon="add" label="Nuevo Usuario" class="q-mr-md" @click="abrirFormulario" />


      <q-select v-model="filtroSeleccionado" :options="opcionesFiltro" label="Filtrar por" outlined dense
        style="min-width: 200px;" @update:modelValue="aplicarFiltro" />
    </div>

    <!-- Tabla de Campañas -->
    <q-table title="Usuarios" title-class="text-primary text-weight-bolder text-h5" :rows="usuarios" :columns="columnas"
      row-key="_id" :loading="loading" :filter="busqueda" class="shadow-1">
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
              {{ modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </div>
            <q-btn flat dense icon="close" class="text-white" v-close-popup />
          </div>
        </q-card-section>

        <q-form @submit.prevent="guardarDatos">
          <q-card-section class="q-pt-md">
            <q-input outlined v-model="formulario.nombre" label="Nombre" class="q-my-md q-mx-md" :rules="rules.nombre"
              hide-bottom-space />
            <q-input outlined v-model="formulario.telefono" label="Telefono" class="q-my-md q-mx-md"
              :rules="rules.telefono" hide-bottom-space />
            <q-input outlined v-model="formulario.correo" label="Correo" type="email" class="q-my-md q-mx-md"
              :rules="rules.correo" hide-bottom-space />
            <q-input v-if="!modoEdicion" outlined v-model="formulario.contrasena" label="Contraseña" class="q-my-md q-mx-md"
              :rules="rules.contrasena" hide-bottom-space />
            <q-select outlined v-model="formulario.rol" label="Rol" :options="opcionesRol" option-label="label"
              option-value="value" emit-value map-options class="q-my-md q-mx-md" :rules="rules.rol"
              hide-bottom-space />

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
import { useUsuariosStore } from "../store/usuarios.js";
import { useQuasar, Notify } from "quasar";


const storeUsuarios = useUsuariosStore();
const $q = useQuasar();

// Estados
const usuarios = ref([]);
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
//Roles
const opcionesRol = [
  { label: 'Admin', value: 'admin' },
  { label: 'Ayudante', value: 'ayudante' },
  { label: 'Usuario', value: 'usuario' },
];
// Diálogos
const mostrarFormulario = ref(false);


// Formularios
const modoEdicion = ref(false);
const formulario = ref({
  _id: null,
  nombre: '',
  telefono: '',
  correo: '',
  contrasena: '',
  rol: null
});




const rules = {
  nombre: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres',

  ],
  correo: [
    (val) => !!val || 'El email es requerido',
    (val) => /.+@.+\..+/.test(val) || 'El email debe ser válido'
  ],
  telefono: [
    (val) => !!val || 'Este campo es requerido',
    (val) => /^[0-9]{8,20}$/.test(val) || 'Debe tener entre 8 y 20 dígitos'
  ],

  rol: [
    (val) => !!val || 'El rol es obligatorio', // Valida que se seleccione una opción
  ],
};

// columnas de la tabla
const columnas = ref([
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'center' },
  { name: 'telefono', label: 'Telefono', field: 'telefono', align: 'center' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'center' },
  { name: 'rol', label: 'Rol', field: 'rol', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]);


const cargarDatos = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('Filtro seleccionado:', filtroSeleccionado.value); // Debug

    let filtro = filtroSeleccionado.value?.value || 'Listar todos'; // Asegura que accedemos al `value`
    let response;

    if (filtro === 'Activos') {
      response = await storeUsuarios.ListarActivos();
    } else if (filtro === 'Inactivos') {
      response = await storeUsuarios.ListarInactivos();
    } else {
      response = await storeUsuarios.ListarTodos();
    }

    console.log('Datos cargadas después del filtro:', response);
    usuarios.value = response;

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
const toggleEstado = async (usuario) => {
  try {
    if (usuario.estado) {
      await storeUsuarios.desactivarUsuario(usuario._id);
    } else {
      await storeUsuarios.activarUsurio(usuario._id);
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
    correo: '',
    telefono: '',
    contrasena: '',
    rol: '',
  };
  mostrarFormulario.value = true;
};


const editarDatos = (usuario) => {
  modoEdicion.value = true;
  formulario.value = {
    _id: usuario._id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    telefono: usuario.telefono,
    rol: usuario.rol,
    contrasena: usuario.contrasena

  };
  mostrarFormulario.value = true;
};

const guardarDatos = async () => {
  try {
    if (modoEdicion.value) {
      await storeUsuarios.actualizarUsuario(
        formulario.value._id,
        formulario.value
      );
    } else {
      await storeUsuarios.crearUsuario(formulario.value);
    }
    await cargarDatos();
    mostrarFormulario.value = false;
    mostrarExito('Usuario guardado correctamente');
  } catch (error) {
    mostrarError('Error guardando Usuario');
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