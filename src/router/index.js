

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/login.js';  // Pinia store para manejar el estado de autenticación

const routes = [
  { path: '/', component: () => import('../pages/Home.vue') },
  { path: '/login', component: () => import('../pages/Login.vue') },  // Ruta de login
  { path: '/clientes', component: () => import('../pages/Clientes.vue'), meta: { requiresAuth: true } },
  { path: '/configuracion', component: () => import('../pages/Configuracion.vue'), meta: { requiresAuth: true } },
  { path: '/etiquetaSistema', component: () => import('../pages/EtiquetaSistema.vue'), meta: { requiresAuth: true } },
  { path: '/campaniasSistema', component: () => import('../pages/CampaniaSistema.vue'), meta: { requiresAuth: true } },
];
 
// Creación del router con protección de rutas
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación para verificar la autenticación antes de permitir el acceso a páginas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');  // Redirige al login si no está autenticado
  } else {
    next();  // Permite el acceso a la página solicitada
  }
});

export default router;

