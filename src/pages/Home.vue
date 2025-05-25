<template>
  <q-page class="q-pa-none">
    <!-- Hero principal -->
    <div class="q-pa-xl bg-primary text-white text-center">
      <div class="q-gutter-y-md">
        <h1 class="text-h3">Convierte WhatsApp en tu mejor vendedor</h1>
        <p class="text-subtitle1">Automatiza respuestas, segmenta clientes, envía mensajes personalizados y haz seguimiento con inteligencia artificial.</p>
        <q-btn label="¡Quiero mis 7 días gratis!" color="white" text-color="primary" size="lg" @click="abrirFormulario" />
      </div>
    </div>

    <!-- Sección de beneficios -->
    <div class="q-pa-xl bg-grey-1 text-center">
      <h2 class="text-h5 text-primary">¿Por qué elegir WabaCRM?</h2>
      <div class="row q-col-gutter-md q-mt-md justify-center">
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-icon name="auto_awesome" size="lg" color="primary" />
            <h6 class="q-mt-sm">Automatización Inteligente</h6>
            <p>Responde automáticamente a tus clientes con IA entrenada para tu negocio.</p>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-icon name="groups" size="lg" color="primary" />
            <h6 class="q-mt-sm">Seguimiento de Clientes</h6>
            <p>Identifica clientes nuevos, compradores y recurrentes, y actúa según su etiqueta.</p>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-icon name="chat" size="lg" color="primary" />
            <h6 class="q-mt-sm">Mensajes Personalizados</h6>
            <p>Envía mensajes únicos según cada etapa del cliente para aumentar ventas.</p>
          </q-card>
        </div>
      </div>
      <div class="q-mt-lg">
        <q-btn label="Probar ahora" color="primary" size="lg" @click="abrirFormulario" />
      </div>
    </div>

    <!-- Sección CTA final -->
    <div class="q-pa-xl bg-white text-center">
      <h2 class="text-h5 text-primary">Inicia gratis durante 7 días y transforma tu atención al cliente</h2>
      <p>Sin tarjetas de crédito. Sin compromisos. Solo resultados.</p>
      <q-btn label="Crear mi cuenta gratis" color="primary" size="lg" class="q-mt-md" @click="abrirFormulario" />
    </div>

    <!-- Soporte por WhatsApp -->
    <div class="q-pa-md text-center">
      <q-btn flat icon="whatsapp" label="¿Tienes dudas? Escríbenos por WhatsApp" color="green" @click="goToWhatsApp" />
    </div>

    <!-- Modal de Registro -->
    <q-dialog v-model="mostrarFormulario" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="row items-center justify-between">
            <div class="text-h6">Registro de Usuario</div>
            <q-btn flat dense icon="close" class="text-white" v-close-popup />
          </div>
        </q-card-section>

        <q-form @submit.prevent="registrarUsuario">
          <q-card-section>
            <q-input outlined v-model="formulario.nombre" label="Nombre" class="q-my-md" />
            <q-input outlined v-model="formulario.wp" label="Whatsap" class="q-my-md" />
            <q-input outlined v-model="formulario.correo" label="Correo electrónico" type="email" class="q-my-md" />
            <q-input outlined v-model="formulario.contrasena" label="Contraseña" type="password" class="q-my-md" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn type="submit" label="Registrarme" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUsuariosStore } from '../store/usuarios';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const storeUsuarios = useUsuariosStore();

const mostrarFormulario = ref(false);
const formulario = ref({
  nombre: '',
  wp: '',
  correo: '',
  contrasena: '',
  rol: 'usuario',
});

const abrirFormulario = () => {
  mostrarFormulario.value = true;
};

const registrarUsuario = async () => {
  try {
    await storeUsuarios.crearUsuario(formulario.value);
    $q.notify({
      type: 'positive',
      message: 'Usuario registrado correctamente. ¡Inicia sesión!',
    });
    mostrarFormulario.value = false;
    router.push('/login'); // redirige a login
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al registrar usuario',
    });
  }
};

const goToWhatsApp = () => {
  window.open('https://wa.me/573222835250', '_blank');
};
</script>
