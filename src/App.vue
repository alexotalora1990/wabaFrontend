<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          WabaCRM
        </q-toolbar-title>
        <q-space />
        <q-btn flat dense label="Inicio" to="/" color="white" class="q-mr-md" />
        <q-btn v-if="!authStore.token" flat dense label="Iniciar Sesión" @click="goToLogin" color="white" />
        <q-btn v-else flat dense round icon="logout" @click="handleLogout" label="" color="white" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" elevated>
      <q-list>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/usuarios">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Usuarios</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/clientes">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Clientes</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/configuracion">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Configuración</q-item-section>
        </q-item>
                <q-item clickable v-ripple to="/etiqueta">
          <q-item-section avatar>
            <q-icon name="tag" />
          </q-item-section>
          <q-item-section>Etiquetas </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/campanias">
          <q-item-section avatar>
            <q-icon name="campaign" />
          </q-item-section>
          <q-item-section>Campañas </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/configuracion">
          <q-item-section avatar>
            <q-icon name="inventory" />
          </q-item-section>
          <q-item-section>Productos</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from './store/login.js';

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const authStore = useAuthStore();

    onMounted(() => {
      authStore.loadAuthState();
    });

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const handleLogout = () => {
      authStore.logout();
      window.location.href = "/login";
    };

    const goToLogin = () => {
      window.location.href = "/login";
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      handleLogout,
      goToLogin,
      authStore,
    };
  },
};
</script>

<style>
/* Estilos personalizados */
</style>