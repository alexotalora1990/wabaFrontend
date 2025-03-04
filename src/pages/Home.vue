<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md shadow-2" style="max-width: 500px; text-align: center;">
      <q-card-section>
        <h2 class="text-primary">Bienvenido a WabaCRM</h2>
        <p class="text-grey-8">Gestión de clientes simplificada para tu negocio.</p>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-btn label="Contactar por WhatsApp" color="green" icon="whatsapp" @click="goToWhatsApp" class="full-width" />
        <!-- <q-btn label="Registrarse" color="primary" @click="goToRegister" class="full-width" /> -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToWhatsApp() {
      window.open('https://wa.me/573222835250', '_blank');      
    },
    // goToRegister() {
    //   this.$router.push('/register');
    // },
  },
};
</script>

<style scoped>
h2 {
  color: #1976d2;
  font-size: 1.5rem;
}
p {
  font-size: 1rem;
}
</style>