<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Formulario a la izquierda con algún padding -->
          <v-col class="formulario" cols="4" md="4">
            <div class="pa-4">
              <Simulador_Form @datos-simulacion="setSimulacion" />
            </div>
          </v-col>

          <!-- Componente de cálculo a la derecha más ancho -->
          <v-col class="calculos" cols="8" md="8">
            <Simulador_Grafica :datos="datosSimulacion" />
            <Simulador_Calculos :datos="datosSimulacion" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Simulador_Calculos from './components/Simulador_Calculos.vue'
import Simulador_Form from './components/Simulador_Form.vue';
import Simulador_Grafica from './components/Simulador_Grafica.vue';
import './assets/css/app.css'; // Importa el archivo CSS
export default {
  name: 'App',

  components: {
    Simulador_Calculos,
    Simulador_Form,

  },

  data() {
    return {
      datosSimulacion: {}
    };
  },

  methods: {
      setSimulacion (datos) {
        console.log('Datos de simulación', datos);
        this.datosSimulacion = datos;
      }

    }
}
</script>./components/Simulador_Calculos.vue
