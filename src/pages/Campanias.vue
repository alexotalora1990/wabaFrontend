<template>
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
      <!-- Selector de tipo de campaña -->
      <div class="row q-mb-md items-center">
        <q-btn-toggle
          v-model="tipoCampania"
          toggle-color="primary"
          :options="[
            { label: 'Campañas Usuario', value: 'cliente' },
            { label: 'Campañas Sistema', value: 'sistema' }
          ]"
          class="q-mr-md"
        />
        <!-- <q-btn color="primary" icon="add" label="Nueva Campaña" @click="abrirCreacion" /> -->
      </div>
  
      <!-- Filtros y Tabla -->
      <div v-if="tipoCampania === 'cliente'">
        <campanias-cliente />
      </div>
      <div v-else>
        <campanias-sistema />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import CampaniasCliente from './CampaniaCliente.vue';
  import CampaniasSistema from './CampaniaSistema.vue';
  
  // Estado para el tipo de campaña seleccionada
  const tipoCampania = ref('cliente'); // 'cliente' o 'sistema'
  
 
  </script>