<script setup>
import { ref, onMounted, computed } from "vue";
import { useUsuariosStore } from "../store/usuarios.js";
import { usePagoStore } from "../store/pagos.js";
import { useAuthStore } from '../store/login.js';
import { Notify } from 'quasar';

const usuariosStore = useUsuariosStore();
const pagoStore = usePagoStore();
const authStore = useAuthStore();
const usuario = computed(() => authStore.usuario);

const contrasenaActual = ref('');
const nuevaContrasena = ref("");
const confirmacionContrasena = ref("");
const nuevoPlanId = ref("");

onMounted(async () => {
  await usuariosStore.ListarTodos(); // Cargar usuarios (esto debería traer el usuario autenticado también o debes usar otra función como fetchUsuarioActual)
  await pagoStore.ListarTodos();
});


const planes = computed(() => pagoStore.pago);

// Cambiar contraseña
const cambiarContrasena = async () => {
  if (!contrasenaActual.value || !nuevaContrasena.value || !confirmacionContrasena.value) {
    Notify.create({
      type: 'negative',
      message: 'Por favor completa todos los campos.',
    });
    return;
  }

  if (nuevaContrasena.value !== confirmacionContrasena.value) {
    Notify.create({
      type: 'negative',
      message: 'Las contraseñas no coinciden.',
    });
    return;
  }

  try {
    await usuariosStore.cambiarContrasena(contrasenaActual.value, nuevaContrasena.value);
    Notify.create({
      type: 'positive',
      message: 'Contraseña actualizada correctamente.',
    });

    // Limpiar campos
    contrasenaActual.value = '';
    nuevaContrasena.value = '';
    confirmacionContrasena.value = '';
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al cambiar la contraseña.',
    });
  }
};


// Cambiar plan
const cambiarPlan = async () => {
  if (!nuevoPlanId.value) {
    Notify.create({
      type: 'negative',
      message: 'Selecciona un plan.',
    });
    return;
  }
  console.log('Usuario actual:', usuario.value);
  const idUsuario = usuario.value._id || usuario.value.id;

  if (!usuario.value || !idUsuario) {
    Notify.create({
      type: 'negative',
      message: 'No se encontró el ID del usuario.',
    });
    return;
  }

  try {
    await usuariosStore.cambiarPlanMembresia(idUsuario, nuevoPlanId.value);

    Notify.create({
      type: 'positive',
      message: 'Plan cambiado exitosamente.',
    });
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al cambiar el plan.',
    });
  }
};

</script>
<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Configuración de Usuario</h2>

    <div v-if="usuario">
      <div class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-xl font-semibold mb-2">Información Personal</h3>
        <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
        <p><strong>Correo:</strong> {{ usuario.correo }}</p>
        <p><strong>Plan Actual:</strong> {{ usuario.planActual || "Sin plan" }}</p>
        <p><strong>Días Restantes:</strong> {{ usuario.diasRestantes || 0 }}</p>

      </div>

      <!-- Cambiar Contraseña -->
      <div class="bg-white shadow-md rounded-lg p-4 mt-4">
        <h3 class="text-xl font-semibold mb-2">Cambiar Contraseña</h3>
        <q-input v-model="contrasenaActual" label="Contraseña actual" type="password" outlined
          class="w-full p-2 border rounded mb-2" />
        <input type="password" v-model="nuevaContrasena" placeholder="Nueva contraseña"
          class="w-full p-2 border rounded mb-2" />
        <input type="password" v-model="confirmacionContrasena" placeholder="Confirmar contraseña"
          class="w-full p-2 border rounded mb-2" />
        <button @click="cambiarContrasena" class="bg-blue-500 text-white p-2 rounded">
          Cambiar Contraseña
        </button>
      </div>

      <!-- Cambiar Plan -->
      <div class="bg-white shadow-md rounded-lg p-4 mt-4">
        <h3 class="text-xl font-semibold mb-2">Cambiar Plan de Membresía</h3>
        <select v-model="nuevoPlanId" class="w-full p-2 border rounded mb-2">
          <option value="" disabled>Selecciona un plan</option>
          <option v-for="plan in planes" :key="plan._id" :value="plan._id">
            {{ plan.nombre }} - {{ plan.periodo }}
          </option>
        </select>
        <button @click="cambiarPlan" class="bg-green-500 text-white p-2 rounded">
          Cambiar Plan
        </button>
      </div>
    </div>

    <div v-else>
      <p>Cargando información...</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>