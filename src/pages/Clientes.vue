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
          <q-btn flat color="teal" icon="visibility" @click="verCliente(props.row)">
            <q-tooltip>Ver</q-tooltip>
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

    <!-- Diálogo para Ver Detalles del Cliente -->
<q-dialog v-model="mostrarDialogoDetalles" persistent>
  <q-card style="min-width: 700px">
    <q-card-section class="bg-primary text-white">
      <div class="row items-center justify-between">
        <div class="text-h6">
          Detalles de Cliente
        </div>
        <!-- Botón de Cerrar (X) en la esquina superior derecha -->
        <q-btn flat dense icon="close" class="text-white" v-close-popup />
      </div>
    </q-card-section>

    <!-- Contenedor Flexbox para mostrar datos en una columna y botones en la otra -->
    <q-card-section>
      <div class="row q-gutter-md">
        <!-- Columna de Datos -->
        <div class="col-8">
          <div><strong>Nombre:</strong> {{ clienteSeleccionado?.nombre }}</div>
          <div><strong>Documento:</strong> {{ clienteSeleccionado?.documento }}</div>
          <div><strong>Correo:</strong> {{ clienteSeleccionado?.correo }}</div>
          <div><strong>WhatsApp:</strong> {{ clienteSeleccionado?.wp }}</div>
          <div><strong>Dirección:</strong> {{ clienteSeleccionado?.direccion }}</div>
          <div><strong>Ciudad:</strong> {{ clienteSeleccionado?.ciudad }}</div>
          <div><strong>País:</strong> {{ clienteSeleccionado?.pais }}</div>
        </div>

        <!-- Columna de Botones -->
  <div class="col-12" style="display: flex; justify-content: space-between;">
  <!-- Botón Asignar Etiqueta -->
  <q-btn 
    flat 
    icon="label" 
    color="primary" 
    @click="mostrarSelectEtiqueta = true" 
    class="q-mb-md" 
    :style="{ 'min-width': '50px' }">
    <q-tooltip>Asignar Etiqueta</q-tooltip>
  </q-btn>

  <!-- Botón Asignar Campaña -->
  <q-btn 
    flat 
    icon="campaign" 
    color="primary" 
    @click="mostrarSelectCampania = true" 
    class="q-mb-md" 
    :style="{ 'min-width': '50px' }">
    <q-tooltip>Asignar Campaña</q-tooltip>
  </q-btn>

  <!-- Botón Enviar Mensaje -->
  <q-btn 
    flat 
    icon="chat" 
    color="primary" 
    @click="abrirModalMensaje(clienteSeleccionado)" 
    class="q-mb-md" 
    :style="{ 'min-width': '50px' }">
    <q-tooltip>Enviar Mensaje</q-tooltip>
  </q-btn>

  <!-- Botón Ver Historial -->
  <q-btn 
    flat 
    icon="history" 
    color="primary" 
    @click="descargarHistorial" 
    class="q-mb-md" 
    :style="{ 'min-width': '50px' }">
    <q-tooltip>Ver Historial</q-tooltip>
  </q-btn>
</div>


      </div>
    </q-card-section>
  </q-card>
</q-dialog>



<!-- Modal para Enviar mensaje  -->
<q-dialog v-model="mostrarModalMensaje" persistent>
  <q-card style="min-width: 500px">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">
        Enviar mensaje a {{ clienteSeleccionado?.nombre }}
      </div>
    </q-card-section>

    <q-card-section>
      <q-input v-model="mensaje" label="Escribe tu mensaje" type="textarea" outlined />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="red" v-close-popup />
      <q-btn flat label="Enviar" color="primary" @click="enviarMensaje" />
    </q-card-actions>
  </q-card>
</q-dialog>

<!-- Dialogo para Asignar Etiqueta -->
<q-dialog v-model="mostrarSelectEtiqueta" persistent>
  <q-card style="min-width: 500px">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Asignar Etiqueta</div>
    </q-card-section>

    <q-card-section>
      <q-select
        v-model="etiquetaSeleccionada"
        :options="etiquetas"
        label="Selecciona una etiqueta"
        outlined
        dense
        @update:modelValue="asignarEtiqueta"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="red" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

<!-- Dialogo para Asignar Campaña -->
<q-dialog v-model="mostrarSelectCampania" persistent>
  <q-card style="min-width: 500px">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Asignar Campaña</div>
    </q-card-section>

    <q-card-section>
      <q-select
        v-model="campaniaSeleccionada"
        :options="campanias"
        label="Selecciona una campaña"
        outlined
        dense
        @update:modelValue="asignarCampania"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="red" v-close-popup />
    </q-card-actions>
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
import { useCampaniaClienteStore } from '../store/campaniaCliente.js';
import { useEtiquetaClienteStore } from "../store/etiquetaCliente.js";

const authStore = useAuthStore();

const $q = useQuasar();
const storeClientes = useClientesStore();
const storeUsuarios = useUsuariosStore();
const storeCampanias = useCampaniaClienteStore();
const storeEtiquetas = useEtiquetaClienteStore();

// Campañas

const mostrarSelectCampania = ref(false);
const campaniaSeleccionada = ref(null);
const campanias = ref([]);
const enviarMensaje = ref('');

// Obtener las campañas desde la API (similarly to how etiquetas were fetched)
const cargarCampanias = async () => {
  try {
    const response = await storeCampanias.ListarTodos(); // Asegúrate de que esta función esté en tu store
    campanias.value = response.map(campania => ({
      label: campania.nombre, // Nombre de la campaña
      value: campania._id     // ID de la campaña
    }));
  } catch (err) {
    console.error('Error cargando campañas:', err);
  }
};

// Asignar campaña al cliente seleccionado
const asignarCampania = () => {
  if (campaniaSeleccionada.value) {
    console.log('Campaña asignada:', campaniaSeleccionada.value);
    
    mostrarSelectCampania.value = false; // Cerrar el modal después de la asignación
  }
};

// Etiquetas
const asignarEtiqueta = () => {
  if (etiquetaSeleccionada.value) {
    console.log('Etiqueta asignada:', etiquetaSeleccionada.value);
    
    mostrarSelectEtiqueta.value = false; // Cerrar el modal después de la asignación
  }
};

// Variables para manejar la selección
const mostrarSelectEtiqueta = ref(false);
const etiquetaSeleccionada = ref(null);
const etiquetas = ref([]);

// Obtener las etiquetas desde la API
const cargarEtiquetas = async () => {
  try {
    const response = await storeEtiquetas.ListarTodos(); // Método para obtener las etiquetas
    etiquetas.value = response.map(etiqueta => ({
      label: etiqueta.nombre, // Nombre de la etiqueta
      value: etiqueta._id    // ID de la etiqueta
    }));
  } catch (err) {
    console.error('Error cargando etiquetas:', err);
  }
};





// Estados

const usuarios = [];
const idUsuario = ref('')
let datos = {}
let options = ref(usuarios)
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
const mostrarDialogoDetalles = ref(false);
const mostrarModalMensaje = ref(false);
const mensaje = ref('');
const clienteSeleccionado = ref(null);

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
  { name: 'wp', label: 'WhatsApp', field: 'wp', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
];





// Método para cargar campañas según el filtro

async function listarUsuarios() {
  const response = await storeUsuarios.ListarActivos()

  response.forEach(item => {
    datos = {
      label: item.nombre,
      value: item._id
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
  cargarCampanias();
    cargarEtiquetas();
});

// Método para abrir el formulario de detalles del cliente
const verCliente = (cliente) => {
  clienteSeleccionado.value = cliente;
  mostrarDialogoDetalles.value = true;
};
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

// Método para abrir el modal de mensaje
const abrirModalMensaje = (cliente) => {
  clienteSeleccionado.value = cliente;
  mensaje.value = `Hola ${cliente.nombre}, ¿cómo estás?`;  // Mensaje por defecto
  mostrarModalMensaje.value = true;
};


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

const descargarHistorial=()=>{

}

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
  border: 2px solid black
    /* Borde más grueso y color blanco */

}
</style>
