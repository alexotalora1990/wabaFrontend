<template>
    <div>
      <h1>Bienvenido a WabaCRM</h1>
      <p>Gestión de clientes simplificada.</p>
      <q-btn label="Iniciar Sesión" color="primary" @click="goToClientes" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home',
    methods: {
      goToClientes() {
        this.$router.push('/login');
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    color: #4caf50;
    text-align: center;
  }
  p {
    text-align: center;
    font-size: 1.2rem;
  }
  </style>
  