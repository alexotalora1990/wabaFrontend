<template>
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
      <!-- Selector de tipo de campaña -->
      <div class="row q-mb-md items-center">
        <q-btn-toggle
          v-model="tipoEtiqueta"
          toggle-color="primary"
          :options="[
            { label: 'Etiquetas Usuario', value: 'usuario' },
            { label: 'Etiquetas Sistema', value: 'sistema' }
          ]"
          class="q-mr-md"
        />
        
      </div>
  
      <!-- Filtros y Tabla -->
      <div v-if="tipoEtiqueta === 'usuario'">
        <etiquetas-usuario />
      </div>
      <div v-else>
        <etiquetas-sistema />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
 
  import EtiquetasUsuario from './EtiquetaCliente.vue'
  import EtiquetasSistema from './EtiquetaSistema.vue';
  
  // Estado para el tipo de campaña seleccionada
  const tipoEtiqueta = ref('usuario'); // 'cliente' o 'sistema'
  
 
  </script>