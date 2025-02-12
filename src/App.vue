<!-- App.vue -->
<template>
  <q-layout view="hHh lpR lFf">
    <!-- Barra superior -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          WabaCRM
        </q-toolbar-title>
        <q-btn flat dense round icon="logout" @click="handleLogout" label="" color="white" />
      </q-toolbar>
    </q-header>

    <!-- Barra lateral (Drawer) -->
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
        <q-item clickable v-ripple to="/etiquetaSistema">
          <q-item-section avatar>
            <q-icon name="tag" />
          </q-item-section>
          <q-item-section>Etiquetas</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/campaniasSistema">
          <q-item-section avatar>
            <q-icon name="campaign" />
          </q-item-section>
          <q-item-section>Campañas</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/configuracion">
          <q-item-section avatar>
            <q-icon name="inventory" />
          </q-item-section>
          <q-item-section>Productos</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Contenedor principal -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Barra inferior -->
    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="home" to="/" aria-label="Inicio" />
        <q-btn flat dense round icon="people" to="/clientes" aria-label="Clientes" />
        <q-btn flat dense round icon="settings" to="/configuracion" aria-label="Configuración" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from './store/login.js'; // Importa el store

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const authStore = useAuthStore();

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    // Cargar el estado de autenticación al iniciar la aplicación
    onMounted(() => {
      authStore.loadAuthState();
    });

    const handleLogout = () => {
      authStore.logout();
      window.location.href = "/login"; // Mejor redirigir en lugar de recargar
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      handleLogout,
    };
  },
};
</script>


<style>
/* Agrega estilos personalizados si es necesario */
</style>
