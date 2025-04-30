

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth.js';  // Pinia store para manejar el estado de autenticación
import { Notify } from 'quasar';

const routes = [
  { path: '/', component: () => import('../pages/Home.vue') },
  { path: '/login', component: () => import('../pages/Login.vue') },  // Ruta de login
  { path: '/recuperar-password', component: () => import('../pages/RecuperarPassword.vue') },
  { path: '/reset-password/:token', component: () => import('../pages/ResetPassword.vue') },
  {path:'/usuarios', component:()=> import('../pages/Usuario.vue'), meta:{requiresAuth:true, allwedRoles:['admin']}},
  { path: '/clientes', component: () => import('../pages/Clientes.vue'), meta: { requiresAuth: true, allwedRoles:['admin','ayudante','usuario'] } },
  { path: '/configuracion', component: () => import('../pages/Configuracion.vue'), meta: { requiresAuth: true },allwedRoles:['admin','ayudante','usuario'] },
  {path:'/campanias',component:()=> import('../pages/Campanias.vue'),meta:{requiresAuth:true,allwedRoles:['admin','ayudante','usuario']},},
  {path:'/etiqueta',component:()=> import('../pages/Etiquetas.vue'),meta:{requiresAuth:true,allwedRoles:['admin','ayudante','usuario']},},
  {path: '/pago', component: () => import('../pages/Pago.vue'), meta: { requiresAuth: true },allwedRoles:['admin','ayudante'] },
  // { path: '/etiquetaSistema', component: () => import('../pages/EtiquetaSistema.vue'), meta: { requiresAuth: true } },
  // { path: '/etiquetaCliente', component: () => import('../pages/EtiquetaCliente.vue'), meta: { requiresAuth: true } },
  // { path: '/campaniasSistema', component: () => import('../pages/CampaniaSistema.vue'), meta: { requiresAuth: true } },
  // {path:'/campaniasCliente',component:()=> import('../pages/CampaniaCliente.vue'),meta:{requiresAuth:true},},
  {path: '/producto', component:()=> import('../pages/Productos.vue'), meta: { requiresAuth: true },allwedRoles:['admin','ayudante','usuario'] },
];
 
// Creación del router con protección de rutas
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación para verificar la autenticación antes de permitir el acceso a páginas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  console.log('Rol del usuario:', authStore.rol); // Depuración
  console.log('Token del usuario:', authStore.token); // Depuración

  // Verifica si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login'); // Redirige al login si no está autenticado
  }
  // Verifica si el rol del usuario está permitido
  else if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(authStore.rol)) {
    // Muestra una notificación de error
    Notify.create({
      type: 'negative',
      message: 'No tienes permisos para acceder a esta página.',
      position: 'top',
    });

    // Redirige a la página de inicio después de un pequeño retraso
    setTimeout(() => {
      next('/');
    }, 1000); // Retraso de 1 segundo (1000 ms)
  } else {
    next(); // Permite el acceso
  }
});

export default router;

