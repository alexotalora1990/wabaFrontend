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
    
    <!-- Tabla de Clientes -->
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
            <q-tooltip>{{ props.row.estado ? "Desactivar" : "Activar" }}</q-tooltip>
          </q-btn>
          <!-- Nuevo botón Ver -->
          <q-btn flat color="teal" icon="visibility" @click="verCliente(props.row)">
            <q-tooltip>Ver</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo para Ver Detalles del Cliente -->
    <q-dialog v-model="mostrarDialogoDetalles" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Detalles de Cliente
          </div>
        </q-card-section>

        <q-card-section>
          <div><strong>Nombre:</strong> {{ clienteSeleccionado?.nombre }}</div>
          <div><strong>Documento:</strong> {{ clienteSeleccionado?.documento }}</div>
          <div><strong>Correo:</strong> {{ clienteSeleccionado?.correo }}</div>
          <div><strong>WhatsApp:</strong> {{ clienteSeleccionado?.wp }}</div>
          <div><strong>Dirección:</strong> {{ clienteSeleccionado?.direccion }}</div>
          <div><strong>Ciudad:</strong> {{ clienteSeleccionado?.ciudad }}</div>
          <div><strong>País:</strong> {{ clienteSeleccionado?.pais }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="red" v-close-popup />
          <q-btn flat label="Enviar mensaje" color="primary" @click="abrirModalMensaje(clienteSeleccionado)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal para Enviar Mensaje -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useClientesStore } from '../store/clientes.js'; 
import axios from 'axios';
import { useAuthStore } from '../store/auth.js'; // Asegúrate de que el path es correcto

const authStore = useAuthStore();


const $q = useQuasar();
const storeClientes = useClientesStore();



// Variables para el cliente seleccionado y el diálogo
const mostrarDialogoDetalles = ref(false);
const mostrarModalMensaje = ref(false);
const clienteSeleccionado = ref(null);
const mostrarFormulario = ref(false);
const mensaje = ref('');

// Columna de la tabla para mostrar solo el nombre, WhatsApp, estado y acciones
const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'center' },
  { name: 'wp', label: 'WhatsApp', field: 'wp', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
];

// Método para cargar los clientes (adaptado para tu estructura)
const clientes = ref([]);
const loading = ref(false);
const busqueda = ref('');
const error = ref("")


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

// Filtros
const filtroSeleccionado = ref('Listar todos'); // Valor inicial
const opcionesFiltro = [
  { label: 'Listar todos', value: 'Listar todos' },
  { label: 'Activos', value: 'Activos' },
  { label: 'Inactivos', value: 'Inactivos' }
];

// Aplicar filtro manualmente
const aplicarFiltro = () => {
  console.log('Filtro seleccionado:', filtroSeleccionado.value);
  cargarDatos();
};

// Observa los cambios en `filtroSeleccionado` y aplica el filtro automáticamente
watch(filtroSeleccionado, () => {
  aplicarFiltro();
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

// Método para abrir el formulario de detalles del cliente
const verCliente = (cliente) => {
  clienteSeleccionado.value = cliente;
  mostrarDialogoDetalles.value = true;
};

// Método para cambiar el estado de un cliente (activar/desactivar)
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

// Método para cargar los clientes desde el store
const cargarDatos = async () => {
  try {
    loading.value = true;
    const response = await storeClientes.ListarTodos();
    clientes.value = response;
  } catch (err) {
    console.error('Error cargando datos:', err);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los datos',
      position: 'top-right'
    });
  } finally {
    loading.value = false;
  }
};

// Método para abrir el modal de mensaje
const abrirModalMensaje = (cliente) => {
  clienteSeleccionado.value = cliente;
  mensaje.value = `Hola ${cliente.nombre}, ¿cómo estás?`;  // Mensaje por defecto
  mostrarModalMensaje.value = true;
};

// Método para editar los datos del cliente
const editarDatos = (cliente) => {
  // Aquí puedes definir lo que necesites hacer para editar los datos
  clienteSeleccionado.value = cliente;
  mostrarDialogoDetalles.value = true;
  // También puedes asignar los valores del cliente a un formulario si lo tienes
  console.log('Editar datos del cliente:', cliente);
};

// Método para enviar el mensaje
const enviarMensaje = async () => {
  try {
    const payload = {
      to: clienteSeleccionado.value.wp, // Número de WhatsApp del cliente
      message: mensaje.value // El mensaje que se ingresa
    };

    // Realizar la solicitud POST
    const response = await axios.post(
      'https://t7rf3j94-4700.use2.devtunnels.ms/v1/messages',
      payload
    );

    // Manejar la respuesta
    $q.notify({
      type: 'positive',
      message: 'Mensaje enviado correctamente',
      position: 'top-right'
    });

    console.log('Mensaje enviado:', response);
    mostrarModalMensaje.value = false;
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al enviar el mensaje',
      position: 'top-right'
    });
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  cargarDatos();
});



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
</style>
