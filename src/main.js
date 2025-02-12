import { createApp } from 'vue';
import { Quasar, Notify, Loading, Dialog } from 'quasar'; // Importa los plugins Notify y Loading
import quasarLang from 'quasar/lang/es'; // Idioma español
import '@quasar/extras/material-icons/material-icons.css'; // Iconos de Quasar
import 'quasar/src/css/index.sass'; // Estilos globales de Quasar

import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // Correcto: importa createPinia
import axios from "axios";

// Crea la instancia de Pinia
const pinia = createPinia();

// Crea la aplicación
const app = createApp(App);

// Usa Pinia en la aplicación (antes de cualquier store)
app.use(pinia);



// Configura Quasar
app.use(Quasar, {
  plugins: [Notify, Loading, Dialog], // Asegúrate de importar los plugins correctamente
  lang: quasarLang, // Configura el idioma
});

// Usa el router
app.use(router);

// Monta la aplicación
app.mount('#app');

// Configura la ruta principal para Axios
axios.defaults.baseURL = "http://localhost:4000/api/";