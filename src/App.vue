<template>
  <v-app>
    <v-app-bar color="surface" elevation="2" density="comfortable">
      <v-app-bar-title>
        <span class="text-primary font-weight-bold text-body-1 text-sm-h6">
          Simulador de Crédito
        </span>
      </v-app-bar-title>
      <template #append>
        <v-btn
          v-if="datosSimulacion.simulacion"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-file-pdf-box"
          size="small"
          class="mr-2"
          :loading="generandoPDF"
          @click="descargarPDF"
        >
          <span class="d-none d-sm-inline">Descargar PDF</span>
          <span class="d-inline d-sm-none">PDF</span>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-0">
        <v-row no-gutters class="main-row">
          <v-col class="formulario" cols="12" sm="5" md="4" lg="3">
            <div class="formulario-inner pa-3 pa-sm-4">
              <Simulador_Form @datos-simulacion="setSimulacion" />
            </div>
          </v-col>

          <v-col ref="calculosSection" class="calculos" cols="12" sm="7" md="8" lg="9">
            <div class="pa-3 pa-sm-4">
              <Simulador_Grafica :datos="datosSimulacion" />
              <Simulador_Calculos
                :datos="datosSimulacion"
                @datos-simulacion="setAbonos"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Simulador from './js/Simulador.js'
import { generarPDF } from './js/generarPDF.js'
import Simulador_Calculos from './components/Simulador_Calculos.vue'
import Simulador_Form from './components/Simulador_Form.vue'
import Simulador_Grafica from './components/Simulador_Grafica.vue'
import './assets/css/app.css'

export default {
  name: 'App',

  components: {
    Simulador_Calculos,
    Simulador_Form,
    Simulador_Grafica,
  },

  data() {
    return {
      credito: null,
      datosSimulacion: {},
      generandoPDF: false,
    }
  },

  methods: {
    setSimulacion(datos) {
      this.credito = new Simulador(datos.monto, datos.periodo, datos.tasa, datos.plazo)
      this.datosSimulacion = this.credito.simular()

      // En móvil, desplazar a los resultados automáticamente
      if (window.innerWidth < 600) {
        this.$nextTick(() => {
          this.$refs.calculosSection?.$el?.scrollIntoView({ behavior: 'smooth' })
        })
      }
    },
    setAbonos(datos) {
      this.credito.setAbonos(datos)
      this.datosSimulacion = this.credito.simular()
    },
    async descargarPDF() {
      this.generandoPDF = true
      await this.$nextTick()
      const lineCanvas = document.getElementById('saldo-chart')
      const barCanvas = document.getElementById('bar-chart')
      generarPDF(this.datosSimulacion, {
        line: lineCanvas?.toDataURL('image/png'),
        bar: barCanvas?.toDataURL('image/png'),
      })
      this.generandoPDF = false
    },
  },
}
</script>

<style>
.main-row {
  min-height: calc(100vh - 56px);
}

@media (min-width: 600px) {
  .main-row {
    min-height: calc(100vh - 64px);
  }

  .formulario {
    position: sticky;
    top: 64px;
    height: calc(100vh - 64px);
    overflow-y: auto;
  }
}

.formulario-inner {
  min-height: 100%;
}
</style>
