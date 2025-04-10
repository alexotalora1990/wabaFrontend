<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.js'
import { Notify } from 'quasar'

const route = useRoute()
const router = useRouter()
const token = route.params.token

const nuevaContrasena = ref('')
const confirmarContrasena = ref('')
const mostrarContrasena = ref(false)
const mostrarConfirmar = ref(false)

const auth = useAuthStore()

const enviarReset = async () => {
  if (nuevaContrasena.value !== confirmarContrasena.value) {
    Notify.create({
      type: 'negative',
      message: 'Las contraseñas no coinciden.',
      position: 'top-right'
    })
    return
  }

  try {
    const mensaje = await auth.resetearContrasena(token, nuevaContrasena.value)

    Notify.create({
      type: 'positive',
      message: mensaje,
      position: 'top-right'
    })

    nuevaContrasena.value = ''
    confirmarContrasena.value = ''

    setTimeout(() => router.push('/login'), 3000)
  } catch (e) {
    Notify.create({
      type: 'negative',
      message: e,
      position: 'top-right'
    })
  }
}
</script>

<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg shadow-2" style="max-width: 400px; width: 100%;">
      <q-card-section class="text-center">
        <div class="text-h6 text-primary">Restablecer Contraseña</div>
        <div class="text-subtitle2 q-mt-xs">Ingresa y confirma tu nueva contraseña</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="nuevaContrasena"
          :type="mostrarContrasena ? 'text' : 'password'"
          label="Nueva contraseña"
          filled
          dense
          autofocus
        >
          <template #append>
            <q-icon
              :name="mostrarContrasena ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="mostrarContrasena = !mostrarContrasena"
            />
          </template>
        </q-input>

        <q-input
          v-model="confirmarContrasena"
          :type="mostrarConfirmar ? 'text' : 'password'"
          label="Confirmar contraseña"
          filled
          dense
          class="q-mt-md"
        >
          <template #append>
            <q-icon
              :name="mostrarConfirmar ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="mostrarConfirmar = !mostrarConfirmar"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          label="Actualizar contraseña"
          color="primary"
          class="full-width"
          @click="enviarReset"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
