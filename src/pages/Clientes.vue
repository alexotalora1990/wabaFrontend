<template>
  <div style="height: 1200px; margin: 0 auto; padding: 20px;">
    <!-- Loading -->
    <div v-if="storeClientes.loading" class="overlay">
      <q-spinner size="80px" color="grey" />
    </div>

    <!-- Filtros y Botón Crear -->
    <div class="row q-mb-md items-center">
      <q-btn color="primary" icon="add" label="Nuevo Cliente" class="q-mr-md" @click="abrirFormulario" />


      <q-select v-model="filtroSeleccionado" :options="opcionesFiltro" label="Filtrar por" outlined dense
        style="min-width: 200px;" @update:modelValue="aplicarFiltro" />
    </div>

    <!-- Tabla de Campañas -->
    <q-table title="Clientes" title-class="text-primary text-weight-bolder text-h5" :rows="clientes" :columns="columnas"
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
          <q-btn flat color="teal" icon="list">
            <q-tooltip>Ver Etiquetas</q-tooltip>
          </q-btn>





        </q-td>
      </template>
    </q-table>



    <!-- Diálogo para Crear/Editar  -->
    <q-dialog v-model="mostrarFormulario" persistent>
      <q-card style="min-width: 500px">

        <q-card-section class="bg-primary text-white">
          <div class="row items-center justify-between">
            <div class="text-h6">
              {{ modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente' }}
            </div>
            <q-btn flat dense icon="close" class="text-white" v-close-popup />
          </div>
        </q-card-section>

        <q-form @submit.prevent="guardarDatos">
          <q-card-section class="q-pt-md">
          
            <q-input outlined v-model="formulario.nombre" label="Nombre" class="q-my-md q-mx-md" :rules="rules.nombre"
              hide-bottom-space />
            <q-input outlined v-model="formulario.documento" label="Documento" class="q-my-md q-mx-md"
              :rules="rules.documento" hide-bottom-space />
            <q-input outlined v-model="formulario.correo" label="Correo" type="email" class="q-my-md q-mx-md"
              :rules="rules.correo" hide-bottom-space />
            <q-input outlined v-model="formulario.wp" label="WhatsApp" class="q-my-md q-mx-md" :rules="rules.wp"
              hide-bottom-space />
            <q-input outlined v-model="formulario.direccion" label="Dirección" class="q-my-md q-mx-md"
              :rules="rules.direccion" hide-bottom-space />
            <q-input outlined v-model="formulario.ciudad" label="Ciudad" class="q-my-md q-mx-md" :rules="rules.ciudad"
              hide-bottom-space />
            <q-input outlined v-model="formulario.pais" label="País" class="q-my-md q-mx-md" :rules="rules.pais"
              hide-bottom-space />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" outline color="red" class="custom-border" v-close-popup />
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
                <q-btn flat color="blue" icon="edit" @click="editarPaso(props.row)">
                  <q-tooltip>Editar paso</q-tooltip>
                </q-btn>

                <!-- Botón de eliminar con tooltip -->
                <q-btn flat color="red" icon="delete" @click="confirmarEliminarPaso(props.row)">
                  <q-tooltip>Eliminar paso</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <q-btn color="primary" icon="add" label="Nuevo Paso" class="q-mt-md" @click="abrirCreacionPaso" />
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

        <q-form @submit.prevent="guardarPaso">
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
import { useClientesStore } from '../store/clientes.js';
import { useUsuariosStore } from '../store/usuarios.js';
import { useAuthStore } from '../store/auth.js'; // Asegúrate de que el path es correcto

const authStore = useAuthStore();

const $q = useQuasar();
const storeClientes = useClientesStore();
const storeUsuarios=useUsuariosStore();

// Estados

const usuarios=[];
const idUsuario=ref('')
let datos={}
let options=ref(usuarios)
const clientes = ref([]);
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
const mostrarDialogoPasos = ref(false);
const mostrarDialogoPaso = ref(false);

// Formularios
const modoEdicion = ref(false);
const formulario = ref({
  _id: null,
  nombre: '',
  documento: '',
  correo: '',
  wp: '',
  direccion: '',
  ciudad: '',
  pais: '',
  
});

// const modoEdicionPaso = ref(false);
// const formularioPaso = ref({
//   _id: null,
//   numero: '',
//   link: '',
//   descripcion: ''
// });

// // Datos temporales
// const clienteSeleccionado = ref(null);
// const pasos = ref([]);


const rules = {
  nombre: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres',
    (val) => /^[a-zA-Z\s]*$/.test(val) || 'Solo se permiten letras'
  ],
  direccion: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
  ],
  documento: [
    (val) => !!val || 'Teléfono no puede estar vacío',
    (val) => /^[0-9]{8,12}$/.test(val) || 'Teléfono debe tener entre 8 y 12 dígitos'
  ],
  correo: [
    (val) => !!val || 'El email es requerido',
    (val) => /.+@.+\..+/.test(val) || 'El email debe ser válido'
  ],
  ciudad: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
  ],
  pais: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
  ],
  wp: [
    (val) => !!val || 'Este campo es requerido',
    (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
  ]
};
// Columnas de la tabla
const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'center' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'center' },
  { name: 'wp', label: 'WhatsApp', field: 'wp', align: 'center' },

  { name: 'documento', label: 'Documento', field: 'documento', align: 'center' },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'center' },
  { name: 'ciudad', label: 'Ciudad', field: 'ciudad', align: 'center' },
  { name: 'pais', label: 'País', field: 'pais', align: 'center' },
  { name: 'blacklist_estado', label: 'Estado en Blacklist', field: row => row.blacklist.estado, align: 'center' },
  { name: 'blacklist_descripcion', label: 'Descripción en Blacklist', field: row => row.blacklist.descripcion, align: 'center' },
  { name: 'etiquetas', label: 'Etiquetas', field: 'etiquetas', align: 'center' },
  { name: 'campaña', label: 'Campañas', field: 'campaña', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
];

// const columnasPasos = [
//   { name: 'numero', label: 'Paso', field: 'numero', align: 'left' },
//   { name: 'descripcion', label: 'Descripción', field: 'descripcion' },
//   { name: 'link', label: 'URL', field: 'link' },
//   { name: 'acciones', label: 'Acciones', align: 'center' }
// ];



// Método para cargar campañas según el filtro

async function listarUsuarios() {
  const response= await storeUsuarios.ListarActivos()

  response.forEach(item =>{
    datos={
      label:item.nombre,
      value:item._id
    }
    usuarios.push(datos)
  })
  console.log(usuarios);
 
} 
function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = usuarios.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}

const cargarDatos = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('Filtro seleccionado:', filtroSeleccionado.value); // Debug

    let filtro = filtroSeleccionado.value?.value || 'Listar todos'; // Asegura que accedemos al `value`
    let response;

    if (filtro === 'Activos') {
      response = await storeClientes.ListarActivos();
    } else if (filtro === 'Inactivos') {
      response = await storeClientes.ListarInactivos();
    } else {
      response = await storeClientes.ListarTodos();
    }

    console.log('Datos cargadas después del filtro:', response);
    clientes.value = response;

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
  listarUsuarios()
});

// Cambiar estado de la campaña
const toggleEstado = async (cliente) => {
  try {
    if (cliente.estado) {
      await storeClientes.desactivarCliente(cliente._id);
    } else {
      await storeClientes.activarCliente(cliente._id);
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
    documento: '',
    correo: '',
    wp: '',
    direccion: '',
    ciudad: '',
    pais: '',
   
  };
  mostrarFormulario.value = true;
};


const editarDatos = (cliente) => {
  modoEdicion.value = true;
  formulario.value = {
    _id: cliente._id,
    
    nombre: cliente.nombre,
    documento: cliente.documento,
    correo: cliente.correo,
    wp: cliente.wp,
    direccion: cliente.direccion,
    ciudad: cliente.ciudad,
    pais: cliente.pais
  };
  mostrarFormulario.value = true;
};

// const guardarDatos = async () => {
//   try {
//     if (modoEdicion.value) {
//       await storeClientes.actualizarCliente(
//         formulario.value._id,
//         formulario.value
//       );
//     } else {
//       await storeClientes.crearCliente(formulario.value);
//     }
//     await cargarDatos();
//     mostrarFormulario.value = false;
//     mostrarExito('Cliente guardado correctamente');
//   } catch (error) {
//     mostrarError('Error guardando cliente');
//   }
// };
const guardarDatos = async () => {
  try {
    if (!modoEdicion.value) {
      // Asignar idUsuario al formulario
      formulario.value.idUsuario = authStore.usuario._id; // o authStore.usuario.id según cómo lo guardes
    }

    if (modoEdicion.value) {
      await storeClientes.actualizarCliente(
        formulario.value._id,
        formulario.value
      );
    } else {
      await storeClientes.crearCliente(formulario.value);
    }

    await cargarDatos();
    mostrarFormulario.value = false;
    mostrarExito('Cliente guardado correctamente');
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    mostrarError('Error guardando cliente');
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
