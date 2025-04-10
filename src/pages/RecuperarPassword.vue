<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth.js'
import { Notify } from 'quasar'

const correo = ref('')
const auth = useAuthStore()

const enviarSolicitud = async () => {
  await auth.solicitarRecuperacion(correo.value)

  if (auth.mensajeRecuperacion) {
    Notify.create({
      type: 'positive',
      message: auth.mensajeRecuperacion,
      position: 'top-right',
      timeout: 3000
    })
    correo.value = ''
  }

  if (auth.errorRecuperacion) {
    Notify.create({
      type: 'negative',
      message: auth.errorRecuperacion,
      position: 'top-right',
      timeout: 3000
    })
  }
}
</script>

<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg shadow-2" style="max-width: 400px; width: 100%;">
      <q-card-section class="text-center">
        <div class="text-h6 text-primary">Recuperar Contraseña</div>
        <div class="text-subtitle2 q-mt-xs">Ingresa tu correo electrónico</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="correo"
          label="Correo electrónico"
          type="email"
          filled
          dense
          autofocus
          :rules="[val => !!val || 'Campo obligatorio']"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          label="Enviar Solicitud"
          color="primary"
          @click="enviarSolicitud"
          class="full-width"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
