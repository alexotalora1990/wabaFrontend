<template>
  <q-page class="q-pa-md">
    <h1>Configuración</h1>
    <p>Aquí puedes gestionar las configuraciones de WabaCRM.</p>

    <div>
      <h2>Información del Usuario</h2>
      <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
      <p><strong>Correo:</strong> {{ usuario.correo }}</p>
      <p><strong>Teléfono:</strong> {{ usuario.telefono }}</p>
      <!-- Muestra otros campos según sea necesario -->
    </div>

    <div>
      <h2>Cambiar Contraseña</h2>
      <q-form @submit.prevent="cambiarContrasena">
        <q-input
          outlined
          v-model="nuevaContrasena"
          type="password"
          label="Nueva Contraseña"
          class="q-my-md q-mx-md"
        />
        <q-input
          outlined
          v-model="confirmacionContrasena"
          type="password"
          label="Confirmar Nueva Contraseña"
          class="q-my-md q-mx-md"
        />
        <q-btn type="submit" label="Cambiar Contraseña" color="primary" />
      </q-form>
      <div v-if="errores.length">
        <ul>
          <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
        </ul>
      </div>
    </div>
  </q-page>
</template>
<script>
import axios from 'axios';

export default {
  name: 'ConfiguracionPage',
  data() {
    return {
      usuario: {
        nombre: '',
        correo: '',
        telefono: '',
        // Otros campos que desees mostrar
      },
      nuevaContrasena: '',
      confirmacionContrasena: '',
      errores: [],
    };
  },
  created() {
    this.obtenerDatosUsuario();
  },
  methods: {
    async obtenerDatosUsuario() {
      try {
        const token = localStorage.getItem('token'); // O donde hayas almacenado el token
        const response = await axios.get('/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.usuario = response.data;
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    },
    async cambiarContrasena() {
      this.errores = [];
      if (this.nuevaContrasena !== this.confirmacionContrasena) {
        this.errores.push('Las contraseñas no coinciden.');
        return;
      }
      if (this.nuevaContrasena.length < 6) {
        this.errores.push('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          '/api/usuario/contrasena',
          { contrasena: this.nuevaContrasena },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Contraseña actualizada correctamente.');
        this.nuevaContrasena = '';
        this.confirmacionContrasena = '';
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        this.errores.push('Hubo un error al cambiar la contraseña.');
      }
    },
  },
};
</script>
