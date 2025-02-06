
<template>
    <div style="height: 100vh; overflow-y: auto;">
      <div v-if="useClientes.loading" class="overlay">
        <q-spinner size="80px" color="grey" />
      </div>
  
      <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
        <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Cliente</q-btn>
        <q-select outlined v-model="listar" label="Seleccione" :options="listados"
          class="q-my-md q-mx-md custom-select" />
        <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
  
        
      </div>
  
      <!-- formulario -->
      <div>
      <q-form ref="formulario" @submit.prevent="modify">
        <q-dialog v-model="alert" persistent>
          <q-card style="width: 700px">
            <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
              <div class="text-h6 text-white">
                {{ accion == 1 ? "Crear Cliente" : "Editar Cliente" }}
              </div>
              <q-space />
              <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
            </q-card-section>
  
            <!-- Inputs con reglas -->
            <q-input
              outlined
              v-model="nombre"
              label="Nombre"
              class="q-my-md q-mx-md"
              :rules="rules.nombre"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="documento"
              label="Documento"
              class="q-my-md q-mx-md"
              :rules="rules.documento"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="correo"
              label="Correo"
              type="email"
              class="q-my-md q-mx-md"
              :rules="rules.correo"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="wp"
              label="WhatsApp"
              class="q-my-md q-mx-md"
              :rules="rules.wp"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="direccion"
              label="Dirección"
              class="q-my-md q-mx-md"
              :rules="rules.direccion"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="ciudad"
              label="Ciudad"
              class="q-my-md q-mx-md"
              :rules="rules.ciudad"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model="pais"
              label="País"
              class="q-my-md q-mx-md"
              :rules="rules.pais"
              hide-bottom-space
            />
            
            
           
            
            <!-- Aquí puedes agregar más campos según sea necesario -->
  
            <q-card-actions align="right">
              <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
              <q-btn
                :label="accion === 1 ? 'Agregar' : 'Editar'"
                type="submit"
                color="green"
                class="text-white"
                @click="modify"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-form>
    </div>
  
      <!-- Tabla -->
      <div style="display: flex; justify-content: center">
        <q-table title="Clientes" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
          :rows="rows" :filter="filter" :columns="columns" :loading="useClientes.loading" row-key="name"
          style="width: 90%; margin-bottom: 6%;">
          <template v-slot:top-right>
            <q-input color="black" v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
  
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
              <p style="color: red;" v-else>Inactivo</p>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="traerDatos(props.row)">
                <q-tooltip>Editar</q-tooltip>✏️
              </q-btn>
              <q-btn @click="desactivar(props.row._id)" v-if="props.row.estado == 1">
                <q-tooltip>Desactivar</q-tooltip>❌
              </q-btn>
              <q-btn @click="activar(props.row._id)" v-else>
                <q-tooltip>Activar</q-tooltip>✅
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useClientesStore } from "../store/clientes.js";
  import { useQuasar, Notify } from "quasar";
  
  const useClientes = useClientesStore();
  console.log("Store clientes inicializado:", useClientes);
  
  const rows = ref([]);
  const id = ref();
  const nombre = ref('');
      const direccion = ref('');
      const correo = ref('');
      const wp = ref('');
      const loading = ref(false);
      const error = ref(null);
      const blacklistEstado = ref(0);
      const blacklistDescripcion = ref('');
      const etiquetas = ref([]);
      const documento = ref('');
      const ciudad = ref('');
      const pais = ref('');
  const filter = ref();
  const listar = ref('');
  const listados = ['Listar todos', 'Activos', 'Inactivos'];
  const formulario = ref(null);
  
  let alert = ref(false);
  let accion = ref(1);
  
  
  
  // reglas de validación
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
    telefono: [
      (val) => !!val || 'Teléfono no puede estar vacío',
      (val) => /^[0-9]{8,12}$/.test(val) || 'Teléfono debe tener entre 8 y 12 dígitos'
    ],
    correo: [
      (val) => !!val || 'El email es requerido',
      (val) => /.+@.+\..+/.test(val) || 'El email debe ser válido'
    ],
    municipio: [
      (val) => !!val || 'Este campo es requerido',
      (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
    ]
  };
  
  // columnas de la tabla
  const columns = ref([
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
    { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' }
  ]);
  
  
  
  
  
  // funciones para obtener los datos
  const listarTodo = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useClientes.ListarTodos();
      console.log("Clientes cargados:", response);
      rows.value = response; 
    } catch (err) {
      error.value = err.message || useClientes.error;
      Notify.create({
        type: "negative",
        message: error.value || "Error al cargar los clientes.",
      });
    } finally {
      loading.value = false;
    }
  };
  
  const listarActivos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useClientes.ListarActivos();
      console.log("Clientes activos cargados:", response);
      rows.value = response; 
    } catch (err) {
      error.value = err.message || useClientes.error;
      Notify.create({
        type: "negative",
        message: error.value || "Error al cargar los clientes activos.",
      });
    } finally {
      loading.value = false;
    }
  };
  
  const listarInactivos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useClientes.ListarInactivos();
      console.log("Clientes inactivos cargados:", response);
      rows.value = response; 
    } catch (err) {
      error.value = err.message || useClientes.error;
      Notify.create({
        type: "negative",
        message: error.value || "Error al cargar los clientes inactivos.",
      });
    } finally {
      loading.value = false;
    }
  };
  
  function filtrar() {
    if (listar.value == 'Listar todos') {
      listarTodo();
    } else if (listar.value == 'Activos') {
      listarActivos();
    } else if (listar.value == 'Inactivos') {
      listarInactivos();
    }
  }
  
  
  
  // operaciones con los datos
  
  
  const crear = async () => {
    loading.value = true;
    error.value = null;
  
    try {
      const cliente = {
        nombre: nombre.value,
        documento: documento.value,
        correo: correo.value,
        wp: wp.value,
        direccion: direccion.value,
        ciudad: ciudad.value,
        pais: pais.value,
        blacklistEstado: blacklistEstado.value,
        blacklistDescripcion: blacklistDescripcion.value,
        etiquetas: etiquetas.value,
      };
  
      const response = await useClientes.crearCliente(cliente);
      console.log('Cliente creado:', response);
      Notify.create({
        type: 'positive',
        message: 'Cliente creado correctamente.',
      });
  
      await listarTodo(); // Actualiza la lista de clientes
      cerrar(); // Cierra el formulario
    } catch (err) {
      error.value = err.message || 'Error al crear el cliente.';
      Notify.create({
        type: 'negative',
        message: error.value,
      });
    } finally {
      loading.value = false;
    }
  };
  
  async function traerDatos(cliente) {
    
    accion.value = 2; // Cambia a modo edición
    alert.value = true; // Abre el formulario
     // Asigna los datos del cliente a los campos del formulario
    id.value = cliente._id; // Verifica que cliente.id exista y sea correcto
    nombre.value = cliente.nombre || '';
    documento.value = cliente.documento || '';
    correo.value = cliente.correo || '';
    wp.value = cliente.wp || '';
    direccion.value = cliente.direccion || '';
    ciudad.value = cliente.ciudad || '';
    pais.value = cliente.pais || '';
    blacklistEstado.value = cliente.blacklistEstado || 0;
    blacklistDescripcion.value = cliente.blacklistDescripcion || '';
    etiquetas.value = cliente.etiquetas || [];
  }
  
  const editar = async () => {
    loading.value = true;
    error.value = null;
  
    try {
      if (!id.value) {
        throw new Error('El ID del cliente no está definido.');
      }
  
      const cliente = {
        nombre: nombre.value,
        documento: documento.value,
        correo: correo.value,
        wp: wp.value,
        direccion: direccion.value,
        ciudad: ciudad.value,
        pais: pais.value,
        blacklistEstado: blacklistEstado.value,
        blacklistDescripcion: blacklistDescripcion.value,
        etiquetas: etiquetas.value,
      };
  
      const response = await useClientes.actualizarCliente(id.value, cliente);
      console.log('Cliente actualizado:', response);
      Notify.create({
        type: 'positive',
        message: 'Cliente actualizado correctamente.',
      });
  
      await listarTodo(); // Actualiza la lista de clientes después de editar
      cerrar(); // Limpia y cierra el formulario
    } catch (err) {
      error.value = err.message || 'Error al actualizar el cliente.';
      Notify.create({
        type: 'negative',
        message: error.value,
      });
    } finally {
      loading.value = false;
    }
  };
  
  
  
  
  
  
  async function modify() {
    const valid = await formulario.value.validate();
    if (!valid) {
      Notify.create({
        type: "negative",
        message: "Por favor, complete correctamente todos los campos",
        icon: "error",
      });
      return;
    }
  
    if (accion.value === 1) {
      await crear();
    } else {
      await editar();
    }
  }
  
  
  
  const activar = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useClientes.activarCliente(id);
      console.log(`Cliente activado:`, response);
      listarTodo()
      Notify.create({
        type: "positive",
        message: `Cliente activado correctamente.`,
      });
    } catch (err) {
      error.value = err.message || useClientes.error;
      Notify.create({
        type: "negative",
        message: error.value || `Error al activar el cliente ${id}.`,
      });
    } finally {
      loading.value = false;
    }
  };
  
  const desactivar = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useClientes.desactivarCliente(id);
      console.log(`Cliente ${id} desactivado:`, response);
      listarTodo()
      Notify.create({
         type: "positive",
        message: `Cliente  desactivado correctamente.`,
      });
    } catch (err) {
      error.value = err.message || useClientes.error;
      Notify.create({
        type: "negative",
        message: error.value || `Error al desactivar el cliente ${id}.`,
      });
    } finally {
      loading.value = false;
    }
  };
  
  
  // funciones adicionales
  onMounted(() => {
    listarTodo();
  });
  
  function abrir() {
    alert.value = true;
    limpiarCampos();
    accion.value = 1;
  }
  
  function cerrar() {
    alert.value = false;
    
  }
  
  function limpiarCampos() {
    nombre.value = '';
    direccion.value = '';
    correo.value = '';
    wp.value = '';
    ciudad.value = '';
    pais.value='';
    documento.value='';
  
  }
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
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; 
  }
  </style>
  