import { createApp } from 'vue';


import { Quasar, Notify, Loading, Dialog } from 'quasar'; // Importa los plugins Notify y Loading
import quasarLang from 'quasar/lang/es'; // Idioma español
import '@quasar/extras/material-icons/material-icons.css'; // Iconos de Quasar
import 'quasar/src/css/index.sass'; // Estilos globales de Quasar

import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // Correcto: importa createPinia
import axios from "axios";

const app = createApp(App);

app.use(Quasar, {
  plugins: [Notify, Loading, Dialog], // Asegúrate de importar los plugins correctamente
  lang: quasarLang, // Configura el idioma

});

const pinia = createPinia(); // Crea la instancia de Pinia
app.use(pinia); // Usa Pinia en tu app

app.use(router); 
app.mount('#app');

// Configura la ruta principal para Axios
axios.defaults.baseURL = "http://localhost:4000/api/";
