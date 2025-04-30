

<template>
  <div class="login-container">
    <!-- Fondo degradado -->
    <div class="background"></div>

    <!-- Card de inicio de sesión -->
    <q-card class="login-card">
      <q-card-section class="text-center">
        <q-avatar size="80px" class="logo">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="Logo" />
        </q-avatar>
        <h2 class="q-mt-md">Iniciar Sesión</h2>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <!-- Campo de correo -->
          <q-input
            v-model="correo"
            label="Correo electrónico"
            type="email"
            outlined
            dense
            :rules="[val => !!val || 'El correo es obligatorio']"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <!-- Campo de contraseña -->
          <q-input
            v-model="contrasena"
            label="Contraseña"
           :type="mostrar ? 'text' : 'password'"
            outlined
            dense
            :rules="[val => !!val || 'La contraseña es obligatoria']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
      <q-icon
        :name="mostrar ? 'visibility_off' : 'visibility'"
        @click="mostrar = !mostrar"
        class="cursor-pointer"
      />
    </template>
          </q-input>
         

          <!-- Botón de inicio de sesión -->
          <q-btn
            type="submit"
            label="Iniciar sesión"
            color="primary"
            class="full-width"
            :loading="loading"
          />
          <div class="text-center q-mt-sm">
  <q-btn
    flat
    label="¿Olvidaste tu contraseña?"
    color="primary"
    @click="goToRecuperar"
  />
</div>
        </q-form>
        
      </q-card-section>

      <!-- Mensaje de error -->
      <q-card-section v-if="errorMessage" class="text-center">
        <q-banner dense class="bg-negative text-white">
          {{ errorMessage }}
        </q-banner>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.js';

export default {
  setup() {
    const correo = ref('josue@gmail.com');
    const contrasena = ref('12345');
    const errorMessage = ref('');
    const loading = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();
    const mostrar = ref(false)

    const handleLogin = async () => {
      try {
        loading.value = true;
        await authStore.login(correo.value, contrasena.value);
        errorMessage.value = '';
        router.push('/clientes');
      } catch (error) {
        errorMessage.value = error.message || 'Error al iniciar sesión. Intenta nuevamente.';
      } finally {
        loading.value = false;
      }
    };
    const goToRecuperar = () => {
  router.push('/recuperar-password');
};
    return {
      correo,
      contrasena,
      errorMessage,
      loading,
      handleLogin,
      goToRecuperar,
      mostrar
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  z-index: -1;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.logo {
  background: white;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.q-input {
  margin-bottom: 16px;
}

.q-btn {
  margin-top: 16px;
  transition: transform 0.2s ease;
}

.q-btn:hover {
  transform: translateY(-2px);
}
</style>