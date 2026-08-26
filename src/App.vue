<template>
  <v-app>
    <v-app-bar color="surface" elevation="2" density="comfortable">
      <template #prepend>
        <v-avatar size="32" class="ml-2">
          <v-img src="./assets/images/logo.svg" alt="Logo"></v-img>
        </v-avatar>
      </template>
      <v-app-bar-title>
        <span class="text-high-emphasis font-weight-black text-body-1 text-sm-h6 marca-titulo">
          Simulador de Crédito
        </span>
      </v-app-bar-title>
      <template #append>
        <Simulador_Prestamos
          :datos-actuales="prestamoActual"
          @abrir-prestamo="abrirPrestamo"
        />
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
              <Simulador_Form ref="form" @datos-simulacion="setSimulacion" />
            </div>
          </v-col>

          <v-col ref="calculosSection" class="calculos" cols="12" sm="7" md="8" lg="9">
            <div class="pa-3 pa-sm-4">
              <template v-if="datosSimulacion.simulacion">
                <Simulador_Grafica :datos="datosSimulacion" />
                <Simulador_Calculos
                  :datos="datosSimulacion"
                  @datos-simulacion="setAbonos"
                />
              </template>

              <div v-else class="estado-vacio">
                <v-icon icon="mdi-calculator-variant-outline" size="64" color="primary" class="mb-4"></v-icon>
                <div class="text-h6 font-weight-bold mb-2">Simula tu crédito</div>
                <p class="text-body-2 text-medium-emphasis">
                  Completa los datos del préstamo y presiona <strong>Calcular</strong>
                  para ver la cuota mensual, los intereses y la tabla de amortización.
                </p>
              </div>
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
import Simulador_Prestamos from './components/Simulador_Prestamos.vue'
import './assets/css/app.css'

export default {
  name: 'App',

  components: {
    Simulador_Calculos,
    Simulador_Form,
    Simulador_Grafica,
    Simulador_Prestamos,
  },

  data() {
    return {
      credito: null,
      datosSimulacion: {},
      generandoPDF: false,
    }
  },

  computed: {
    prestamoActual() {
      if (!this.credito) return null
      return {
        monto: this.credito.monto,
        periodo: this.credito.periodo,
        tasa: this.credito.tasa.anual,
        plazo: this.credito.plazo,
        abonos: this.credito.abonos,
      }
    },
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
    abrirPrestamo(prestamo) {
      this.$refs.form.cargarDatos(prestamo)
      if (this.credito && Array.isArray(prestamo.abonos)) {
        this.credito.abonos = [...prestamo.abonos]
        this.datosSimulacion = this.credito.simular()
      }
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

.marca-titulo {
  letter-spacing: -0.015em;
}

.estado-vacio {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px 16px;
}

.estado-vacio p {
  max-width: 360px;
}
</style>
