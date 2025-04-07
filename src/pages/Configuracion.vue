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

const modalContrasena = ref(false);
const modalPlan = ref(false);

onMounted(async () => {
  await usuariosStore.ListarTodos();
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
    Notify.create({ type: 'positive', message: 'Contraseña actualizada correctamente.' });
    modalContrasena.value = false;
    contrasenaActual.value = '';
    nuevaContrasena.value = '';
    confirmacionContrasena.value = '';
  } catch (error) {
    Notify.create({ type: 'negative', message: error.response?.data?.message || 'Error al cambiar la contraseña.' });
  }
};

// Cambiar plan
const cambiarPlan = async () => {
  if (!nuevoPlanId.value) {
    Notify.create({ type: 'negative', message: 'Selecciona un plan.' });
    return;
  }

  const idUsuario = usuario.value._id || usuario.value.id;

  try {
    await usuariosStore.cambiarPlanMembresia(idUsuario, nuevoPlanId.value);
    Notify.create({ type: 'positive', message: 'Plan cambiado exitosamente.' });
    modalPlan.value = false;
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error al cambiar el plan.' });
  }
};
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-md q-mx-auto config-card">

      <div class="q-card q-pa-md shadow-2 relative-position">
        <div class="q-mb-md">
          <div class="text-h6">Información Personal</div>
          <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
          <p><strong>Correo:</strong> {{ usuario.correo }}</p>

          <q-btn 
            color="primary" 
            label="Cambiar Contraseña" 
            class="q-mt-sm"
            @click="modalContrasena = true"
          />
        </div>

        <div class="plan-box">
          <div class="text-subtitle1">Plan Actual: <strong>{{ usuario.planActual || 'Sin plan' }}</strong></div>
          <div>Días restantes: {{ usuario.diasRestantes || 0 }}</div>
          <q-btn 
            color="green" 
            label="Cambiar Plan" 
            class="q-mt-sm" 
            @click="modalPlan = true"
          />
        </div>
      </div>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <q-dialog v-model="modalContrasena">
      <q-card class="q-pa-md" style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Cambiar Contraseña</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="contrasenaActual" label="Contraseña actual" type="password" outlined />
          <q-input v-model="nuevaContrasena" label="Nueva contraseña" type="password" outlined />
          <q-input v-model="confirmacionContrasena" label="Confirmar contraseña" type="password" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Guardar" color="primary" @click="cambiarContrasena" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Cambiar Plan -->
    <q-dialog v-model="modalPlan">
      <q-card class="q-pa-md" style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Cambiar Plan</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-select 
            v-model="nuevoPlanId" 
            :options="planes.map(p => ({ label: `${p.nombre} - ${p.periodo}`, value: p._id }))" 
            label="Selecciona un nuevo plan" 
            outlined
            emit-value 
            map-options
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Guardar" color="green" @click="cambiarPlan" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.config-card {
  max-width: 700px;
}
.plan-box {
  position: absolute;
  top: 16px;
  right: 16px;
  text-align: right;
}
</style>
